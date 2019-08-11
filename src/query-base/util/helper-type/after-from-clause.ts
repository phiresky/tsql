import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

export type AfterFromClause = (
    IQueryBase<{
        fromClause : FromClauseUtil.AfterFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);