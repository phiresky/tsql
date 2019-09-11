import {IFromClause} from "../../../from-clause";
import {WhereDelegate} from "../../where-delegate";
import {WhereClause} from "../../where-clause";
import {ColumnRefUtil} from "../../../column-ref";
import * as ExprLib from "../../../expr-library";
import {allowedColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {RawExprUtil} from "../../../raw-expr";
import {ExprUtil, IAnonymousExpr} from "../../../expr";
import {IAnonymousColumn} from "../../../column";

/**
 * Returns the MySQL equivalent of `whereClause AND whereDelegate(columns)`
 *
 * @param fromClause
 * @param whereClause
 * @param whereDelegate
 */
export function where<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    whereDelegate : WhereDelegate<FromClauseT>
) : (
    WhereClause
) {
    const columns = allowedColumnRef(fromClause);
    /**
     * Explicit type annotation required or `tsc` crashes
     */
    const operand : (
        boolean|IAnonymousColumn<boolean>|IAnonymousExpr<boolean>
    ) = whereDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    UsedRefUtil.assertAllowed(
        { columns },
        RawExprUtil.usedRef(operand)
    );

    const result : WhereClause = (
        whereClause == undefined ?
        ExprUtil.fromRawExpr(operand) :
        ExprLib.and(whereClause, operand)
    );
    return result;
}
