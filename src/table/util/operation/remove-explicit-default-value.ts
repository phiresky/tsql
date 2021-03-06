import {ITable} from "../../table";
import {Table} from "../../table-impl";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {KeyUtil} from "../../../key";
import {pickOwnEnumerable} from "../../../type-util";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

export type RemoveExplicitDefaultValueColumnAlias<
    TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">
> = (
    Extract<
        keyof TableT["columns"],
        TableT["explicitDefaultValueColumns"][number]
    >
);
export type RemoveExplicitDefaultValueColumnMap<TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">> = (
    {
        readonly [columnAlias in RemoveExplicitDefaultValueColumnAlias<TableT>] : (
            TableT["columns"][columnAlias]
        )
    }
);
export function removeExplicitDefaultValueColumnMap<
    TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">
> (
    table : TableT
) : (
    RemoveExplicitDefaultValueColumnMap<TableT>
) {
    const result : RemoveExplicitDefaultValueColumnMap<TableT> = pickOwnEnumerable(
        table.columns,
        ColumnArrayUtil.fromColumnMap(table.columns)
            .filter(column => {
                return (
                    table.explicitDefaultValueColumns.includes(column.columnAlias)
                );
            })
            .map(column => column.columnAlias)
    ) as RemoveExplicitDefaultValueColumnMap<TableT>;
    return result;
}
export type RemoveExplicitDefaultValueDelegate<
    TableT extends Pick<ITable, "columns"|"explicitDefaultValueColumns">,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveExplicitDefaultValueColumnMap<TableT>>[]
> = (
    (columnMap : RemoveExplicitDefaultValueColumnMap<TableT>) => ColumnsT
);

export type RemoveExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveExplicitDefaultValueColumnMap<TableT>>[]
> = (
    Table<{
        isLateral : TableT["isLateral"],
        alias : TableT["alias"],
        columns : TableT["columns"],
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertEnabled : TableT["insertEnabled"],
        deleteEnabled : TableT["deleteEnabled"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : TableT["nullableColumns"],
        /**
         * Subtract from `explicitDefaultValueColumns`
         */
        explicitDefaultValueColumns : KeyUtil.Subtract<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >,
        mutableColumns : TableT["mutableColumns"],

        explicitAutoIncrementValueEnabled : TableT["explicitAutoIncrementValueEnabled"],
    }>
);
/**
 * Removes columns from the set of columns with explicit `DEFAULT` values
 *
 * @param table
 * @param delegate
 */
export function removeExplicitDefaultValue<
    TableT extends ITable,
    ColumnsT extends readonly ColumnUtil.FromColumnMap<RemoveExplicitDefaultValueColumnMap<TableT>>[]
> (
    table : TableT,
    delegate : (
        RemoveExplicitDefaultValueDelegate<
            TableT,
            ColumnsT
        >
    )
) : (
    RemoveExplicitDefaultValue<TableT, ColumnsT>
) {
    const columnMap = removeExplicitDefaultValueColumnMap(table);
    const columnsT : ColumnsT = delegate(columnMap);

    ColumnIdentifierMapUtil.assertHasColumnIdentifiers(
        columnMap,
        columnsT
    );

    const explicitDefaultValueColumns : (
        KeyUtil.Subtract<
            TableT["explicitDefaultValueColumns"],
            KeyUtil.FromColumnArray<ColumnsT>
        >
    ) = KeyUtil.subtract(
        table.explicitDefaultValueColumns,
        KeyUtil.fromColumnArray(columnsT)
    );

    const {
        isLateral,
        alias,
        columns,
        usedRef,

        autoIncrement,
        id,
        primaryKey,
        candidateKeys,

        insertEnabled,
        deleteEnabled,

        generatedColumns,
        nullableColumns,
        //explicitDefaultValueColumns,
        mutableColumns,

        explicitAutoIncrementValueEnabled,
    } = table;


    const result : RemoveExplicitDefaultValue<TableT, ColumnsT> = new Table(
        {
            isLateral,
            alias,
            columns,
            usedRef,

            autoIncrement,
            id,
            primaryKey,
            candidateKeys,

            insertEnabled,
            deleteEnabled,

            generatedColumns,
            nullableColumns,
            explicitDefaultValueColumns,
            mutableColumns,

            explicitAutoIncrementValueEnabled,
        },
        table.unaliasedAst
    );
    return result;
}
