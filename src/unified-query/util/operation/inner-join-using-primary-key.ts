import {IAliasedTable} from "../../../aliased-table";
import {FromClauseUtil} from "../../../from-clause";
import * as TypeUtil from "../../../type-util";
import {TableWithPrimaryKey, TableUtil} from "../../../table";
import {Query} from "../../query-impl";
import {assertValidJoinTarget, AssertValidCurrentJoin} from "../predicate";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type InnerJoinUsingPrimaryKeyImpl<
    AliasedTableT extends IAliasedTable,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
    MapDelegateT extends AfterFromClause["mapDelegate"],
    GroupByClauseT extends AfterFromClause["groupByClause"],
> =
    Query<{
        fromClause : FromClauseUtil.InnerJoin<FromClauseT, AliasedTableT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
;
export type InnerJoinUsingPrimaryKey<QueryT extends AfterFromClause, AliasedTableT extends IAliasedTable> =
    InnerJoinUsingPrimaryKeyImpl<
        AliasedTableT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
;
export function innerJoinUsingPrimaryKey<
    QueryT extends AfterFromClause,
    SrcT extends QueryT["fromClause"]["currentJoins"][number],
    DstT extends TableWithPrimaryKey
> (
    query : QueryT,
    srcDelegate : FromClauseUtil.InnerJoinUsingPrimaryKeySrcDelegate<QueryT["fromClause"], SrcT>,
    aliasedTable : (
        & DstT
        & TypeUtil.AssertNonUnion<DstT>
        & AssertValidCurrentJoin<QueryT, DstT>
        & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
    )
) : (
    InnerJoinUsingPrimaryKey<QueryT, DstT>
) {
    assertValidJoinTarget(query, aliasedTable);

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : InnerJoinUsingPrimaryKey<QueryT, DstT> = new Query(
        {
            fromClause : FromClauseUtil.innerJoinUsingPrimaryKey<
                QueryT["fromClause"],
                SrcT,
                DstT
            >(
                query.fromClause,
                srcDelegate,
                aliasedTable
            ),
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        query
    );
    return result;
}
