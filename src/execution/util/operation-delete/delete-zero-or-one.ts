import * as tm from "type-mapping";
import {DeletableTable, TableUtil} from "../../../table";
import {WhereDelegate, WhereClause} from "../../../where-clause";
import {FromClauseUtil} from "../../../from-clause";
import {IsolableDeleteConnection} from "../../connection";
import * as impl from "./delete";
import {TooManyRowsFoundError} from "../../../error";
import {DeleteEvent} from "../../../event";
import {IsolationLevel} from "../../../isolation-level";

export interface DeleteZeroOrOneResult {
    query : { sql : string },

    //Alias for affectedRows
    deletedRowCount : 0n|1n;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}
export async function deleteZeroOrOne<
    TableT extends DeletableTable
> (
    table : TableT,
    connection : IsolableDeleteConnection,
    whereDelegate : WhereDelegate<
        FromClauseUtil.From<
            FromClauseUtil.NewInstance,
            TableT
        >
    >
) : Promise<DeleteZeroOrOneResult> {
    TableUtil.assertDeleteEnabled(table);

    return connection.lock(async (connection) : Promise<DeleteZeroOrOneResult> => {
        /**
         * `READ_UNCOMMITTED` because this should be a simple `DELETE` statement.
         * It should execute no other statements.
         */
        const {
            whereClause,
            deleteResult,
        } = await connection.transactionIfNotInOne(IsolationLevel.READ_UNCOMMITTED, async (connection) : Promise<{
            whereClause : WhereClause,
            deleteResult : DeleteZeroOrOneResult,
        }> => {
            return connection.savepoint(async (connection) : Promise<{
                whereClause : WhereClause,
                deleteResult : DeleteZeroOrOneResult,
            }> => {
                const {
                    whereClause,
                    deleteResult,
                } = await impl.deleteImplNoEvent(
                    table,
                    connection,
                    whereDelegate
                );
                if (
                    tm.BigIntUtil.equal(deleteResult.deletedRowCount, tm.BigInt(0)) ||
                    tm.BigIntUtil.equal(deleteResult.deletedRowCount, tm.BigInt(1))
                ) {
                    return {
                        whereClause,
                        deleteResult : deleteResult as DeleteZeroOrOneResult,
                    };
                }
                throw new TooManyRowsFoundError({
                    message : `Expected to delete zero or one row of ${table.alias}; found ${deleteResult.deletedRowCount} rows`,
                    sql : deleteResult.query.sql,
                });
            });
        });

        if (tm.BigIntUtil.equal(deleteResult.deletedRowCount, tm.BigInt(1))) {
            const fullConnection = connection.tryGetFullConnection();
            if (fullConnection != undefined) {
                await fullConnection.eventEmitters.onDelete.invoke(new DeleteEvent({
                    connection : fullConnection,
                    table,
                    whereClause,
                    deleteResult,
                }));
            }
        }

        return deleteResult;
    });
}
