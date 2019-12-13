import {InsertableTablePerType} from "../../table-per-type";
import {CustomInsertRowWithPrimaryKey} from "./insert-row";
import {IsolableInsertOneConnection, ExecutionUtil} from "../../../execution";
import {Identity, OnlyKnownProperties, omitOwnEnumerable} from "../../../type-util";
import {ColumnAlias, ColumnType, implicitAutoIncrement, generatedColumnAliases, findTableWithGeneratedColumnAlias} from "../query";
import {CustomExprUtil} from "../../../custom-expr";
import {DataTypeUtil} from "../../../data-type";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {TableUtil} from "../../../table";
import {expr} from "../../../expr";
import {UsedRefUtil} from "../../../used-ref";

export type InsertAndFetchRow<
    TptT extends InsertableTablePerType
> =
    CustomInsertRowWithPrimaryKey<TptT>
;

export type InsertedAndFetchedRow<
    TptT extends InsertableTablePerType,
    RowT extends InsertAndFetchRow<TptT>
> =
    Identity<{
        readonly [columnAlias in ColumnAlias<TptT>] : (
            columnAlias extends keyof RowT ?
            (
                undefined extends RowT[columnAlias] ?
                ColumnType<TptT, columnAlias> :
                CustomExprUtil.TypeOf<
                    RowT[columnAlias]
                >
            ) :
            ColumnType<TptT, columnAlias>
        )
    }>
;

/**
 * Assumes there are no duplicate `parentTables`.
 *
 * `.addParent()` should remove duplicates.
 */
export async function insertAndFetch<
    TptT extends InsertableTablePerType,
    RowT extends InsertAndFetchRow<TptT>
> (
    tpt : TptT,
    connection : IsolableInsertOneConnection,
    insertRow : OnlyKnownProperties<RowT, InsertAndFetchRow<TptT>>
) : (
    Promise<InsertedAndFetchedRow<TptT, RowT>>
) {
    return connection.transactionIfNotInOne(async (connection) : Promise<InsertedAndFetchedRow<TptT, RowT>> => {
        const generated = generatedColumnAliases(tpt);

        const result : any = omitOwnEnumerable(
            insertRow,
            [
                /**
                 * We omit implicit auto-increment values because we do not
                 * want them to be set by users of the library.
                 */
                ...implicitAutoIncrement(tpt),
                /**
                 * We omit generated values because users can't set them, anyway.
                 */
                ...generated,
            ] as any
        );

        for(const columnAlias of generated) {
            const table = findTableWithGeneratedColumnAlias(
                tpt,
                columnAlias
            );

            const sqlString = await connection.tryFetchGeneratedColumnExpression(
                TableUtil.tryGetSchemaName(table),
                table.alias,
                columnAlias
            );

            if (sqlString == undefined) {
                throw new Error(`Generated column ${table.alias}.${columnAlias} should have generation expression`);
            }

            result[columnAlias] = expr(
                {
                    mapper : table.columns[columnAlias].mapper,
                    usedRef : UsedRefUtil.fromColumnRef({}),
                },
                /**
                 * This `sqlString` is not allowed to reference any columns.
                 * If it does, there is a very high chance that it will cause an error.
                 *
                 * @todo Find use case where we need to allow this to reference columns.
                 */
                sqlString
            );
        }

        for(const table of [...tpt.parentTables, tpt.childTable]) {
            const fetchedRow = await ExecutionUtil.insertAndFetch(
                (
                    /**
                     * We want to allow explicit auto-increment values internally,
                     * so that the same value is used for all tables of the same
                     * inheritance hierarchy.
                     */
                    table.autoIncrement != undefined && !table.explicitAutoIncrementValueEnabled ?
                    {
                        ...table,
                        explicitAutoIncrementValueEnabled : true,
                    } :
                    table
                ),
                connection,
                result as never
            );
            for (const columnAlias of Object.keys(fetchedRow)) {
                /**
                 * This is guaranteed to be a value expression.
                 */
                const newValue = fetchedRow[columnAlias];

                if (Object.prototype.hasOwnProperty.call(result, columnAlias)) {
                    /**
                     * This `curValue` could be a non-value expression.
                     * We only want value expressions.
                     */
                    const curValue = result[columnAlias];

                    if (BuiltInExprUtil.isAnyNonValueExpr(curValue)) {
                        /**
                         * Add this new value to the `result`
                         * so we can use it to insert rows to tables
                         * further down the inheritance hierarchy.
                         */
                        result[columnAlias] = newValue;
                        continue;
                    }

                    if (curValue === newValue) {
                        /**
                         * They are equal, do nothing.
                         */
                        continue;
                    }
                    /**
                     * We need some custom equality checking logic
                     */
                    if (!DataTypeUtil.isNullSafeEqual(
                        table.columns[columnAlias],
                        /**
                         * This may throw
                         */
                        table.columns[columnAlias].mapper(
                            `${table.alias}.${columnAlias}`,
                            curValue
                        ),
                        newValue
                    )) {
                        /**
                         * @todo Custom `Error` type
                         */
                        throw new Error(`All columns with the same name in an inheritance hierarchy must have the same value; mismatch found for ${table.alias}.${columnAlias}`);
                    }
                } else {
                    /**
                     * Add this new value to the `result`
                     * so we can use it to insert rows to tables
                     * further down the inheritance hierarchy.
                     */
                    result[columnAlias] = newValue;
                }
            }
        }

        return result;
    });
}