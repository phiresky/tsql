import {ITable} from "../../table";
import {AliasedTable} from "../../../aliased-table";
import {ColumnMapUtil} from "../../../column-map";

export type As<TableT extends ITable, NewTableAliasT extends string> = (
    AliasedTable<{
        isLateral : TableT["isLateral"],
        tableAlias : NewTableAliasT;
        columns : ColumnMapUtil.WithTableAlias<
            TableT["columns"],
            NewTableAliasT
        >;
        usedRef : TableT["usedRef"];
    }>
);
/**
 * Aliases a table reference in a query.
 *
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable AS aliasedTable
 * ```
 */
export function as<TableT extends ITable, NewTableAliasT extends string> (
    {
        isLateral: isLateral,
        columns,
        usedRef,
        unaliasedAst,
    } : TableT,
    newTableAlias : NewTableAliasT
) : (
    As<TableT, NewTableAliasT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const columnsGeneric : TableT["columns"] = columns;
    return new AliasedTable(
        {
            isLateral,
            tableAlias : newTableAlias,
            columns : ColumnMapUtil.withTableAlias(
                columnsGeneric,
                newTableAlias
            ),
            usedRef : usedRef,
        },
        unaliasedAst
    );
}
