import {HavingDelegate, HavingClauseUtil} from "../../../having-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {QueryUtil} from "../..";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type HavingImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    MapDelegateT extends IQuery["mapDelegate"],
    GroupByClauseT extends IQuery["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type Having<
    QueryT extends IQuery
> = (
    HavingImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export function having<
    QueryT extends QueryUtil.AfterGroupByClause
> (
    query : QueryT,
    havingDelegate : HavingDelegate<QueryT["fromClause"], QueryT["groupByClause"]>
) : (
    Having<QueryT>
) {
    const havingClause = HavingClauseUtil.having<
        QueryT["fromClause"],
        QueryT["groupByClause"]
    >(
        query.fromClause,
        query.groupByClause,
        query.havingClause,
        havingDelegate
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,

        whereClause,
        orderByClause,
        compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : Having<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        {
            whereClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
            isDistinct,
        }
    );
    return result;
}
