import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import {IQuery} from "../../query";
import {Query} from "../../query-impl";

export type RequireNullableOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> = (
    Query<{
        fromClause : FromClauseUtil.RequireNullableOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>,
        selectClause : QueryT["selectClause"],

        limitClause : QueryT["limitClause"],

        unionClause : QueryT["unionClause"],
        unionLimitClause : QueryT["unionLimitClause"],
    }>
);
export function requireNullableOuterQueryJoins<
    QueryT extends IQuery,
    AliasedTablesT extends readonly IAliasedTable[]
> (
    query : QueryT,
    ...aliasedTables : (
        & AliasedTablesT
        & FromClauseUtil.AssertValidOuterQueryJoins<QueryT["fromClause"], AliasedTablesT>
    )
) : (
    RequireNullableOuterQueryJoins<QueryT, AliasedTablesT>
) {
    const {
        //fromClause,
        selectClause,

        limitClause,

        unionClause,
        unionLimitClause,
    } = query;

    const result : RequireNullableOuterQueryJoins<QueryT, AliasedTablesT> = new Query(
        {
            fromClause : FromClauseUtil.requireNullableOuterQueryJoins<
                QueryT["fromClause"],
                AliasedTablesT
            >(
                query.fromClause,
                ...(aliasedTables as any)
            ),
            selectClause,

            limitClause,

            unionClause,
            unionLimitClause,
        },
        query
    );
    return result;
}