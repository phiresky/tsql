import {FromClauseUtil} from "../../../from-clause";
import {allowedColumnRef} from "../query";
import {IAliasedTable} from "../../../aliased-table";
import {OnDelegate} from "../../on-delegate";
import {OnClause} from "../../on-clause";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {assertValidUsedRef} from "../predicate";
import {ExprUtil} from "../../../expr";

export function on<
    FromClauseT extends FromClauseUtil.AfterFromClause,
    AliasedTableT extends IAliasedTable,
    /**
     * @todo This looks like it should be `MapCorrelated`, or `RefCorrelated`.
     * Yet, I don't see that restriction here.
     */
    RawOnClauseT extends BuiltInExpr_NonAggregate<boolean>
> (
    fromClause : FromClauseT,
    aliasedTable : AliasedTableT,
    onDelegate : OnDelegate<FromClauseT, AliasedTableT, RawOnClauseT>
) : (
    OnClause
) {
    const columns = allowedColumnRef(fromClause, aliasedTable);
    const rawOnClause = onDelegate(columns);

    assertValidUsedRef(
        fromClause,
        aliasedTable,
        rawOnClause
    );

    return ExprUtil.fromBuiltInExpr(rawOnClause);
}
