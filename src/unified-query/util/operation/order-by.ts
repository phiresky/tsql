import {OrderByClauseUtil, OrderByDelegateColumns, OrderByDelegateReturnType} from "../../../order-by-clause";
import {Query} from "../../query-impl";
import {IQuery} from "../../query";
import {Correlate, correlate} from "./correlate";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type OrderByImpl<
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
export type OrderBy<
    QueryT extends IQuery
> = (
    OrderByImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
export type QueryOrderByDelegate<QueryT extends IQuery> =
    (
        columns : OrderByDelegateColumns<QueryT["fromClause"], QueryT["selectClause"]>,
        subquery : Correlate<QueryT>
    ) => OrderByDelegateReturnType<QueryT["fromClause"], QueryT["groupByClause"], QueryT["selectClause"]>
;
export function orderBy<
    QueryT extends IQuery
> (
    query : QueryT,
    orderByDelegate : QueryOrderByDelegate<QueryT>
) : (
    OrderBy<QueryT>
) {
    const orderByClause = OrderByClauseUtil.orderBy<
        QueryT["fromClause"],
        QueryT["groupByClause"],
        QueryT["selectClause"]
    >(
        query.fromClause,
        query.groupByClause,
        query.selectClause,
        query.orderByClause,
        (columns) => {
            return orderByDelegate(columns, correlate<QueryT>(query));
        }
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
        havingClause,
        compoundQueryOrderByClause,
        isDistinct,
    } = query;

    const result : OrderBy<QueryT> = new Query(
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
