import {FromClauseUtil} from "../../../from-clause";
import {IAliasedTable} from "../../../aliased-table";
import {RawExpr, RawExprUtil} from "../../../raw-expr";
import {AllowedUsedRef, allowedUsedRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";

export type AssertValidUsedRef<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable,
    RawOnClauseT extends RawExpr<boolean>
> = (
    UsedRefUtil.AssertAllowed<
        AllowedUsedRef<FromClauseT, AliasedTableT>,
        RawExprUtil.UsedRef<RawOnClauseT>
    >
);

export function assertValidUsedRef (
    fromClause : FromClauseUtil.AfterFromClause,
    aliasedTable : IAliasedTable,
    rawOnClause : RawExpr<boolean>
) {
    UsedRefUtil.assertAllowed(
        allowedUsedRef(fromClause, aliasedTable),
        RawExprUtil.usedRef(rawOnClause)
    );
}