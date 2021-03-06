import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

export interface BeforeFromClauseData {
    fromClause : FromClauseUtil.BeforeFromClause,
    selectClause : SelectClause|undefined,

    limitClause : LimitClause|undefined,

    compoundQueryClause : CompoundQueryClause|undefined,
    compoundQueryLimitClause : LimitClause|undefined,

    mapDelegate : MapDelegate|undefined,
    groupByClause : GroupByClause|undefined,
}

export interface BeforeFromClause extends IQueryBase<BeforeFromClauseData> {

}
