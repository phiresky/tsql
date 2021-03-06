import * as tm from "type-mapping";
import {ExprUtil} from "../../expr";
import {BuiltInExpr, AnyBuiltInExpr} from "../../built-in-expr";
import {BuiltInExprUtil} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {BaseType} from "../../type-util";

export type NullSafeEquation2 =
    <
        LeftT extends AnyBuiltInExpr,
        RightT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<LeftT>>|null>
    >(
        left : LeftT,
        right : RightT
    ) => (
        ExprUtil.Intersect<boolean, LeftT|RightT>
    )
;
/**
 * Factory for making null-safe equation operators.
 *
 * These allow `null` in equations.
 */
export function makeNullSafeEquation2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand2<OperatorTypeT>,
    typeHint? : TypeHint
) : NullSafeEquation2 {
    const result : NullSafeEquation2 = <
        LeftT extends AnyBuiltInExpr,
        RightT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<LeftT>>|null>
    >(
        left : LeftT,
        right : RightT
    ) : (
        ExprUtil.Intersect<boolean, LeftT|RightT>
    ) => {
        return ExprUtil.intersect<boolean, LeftT|RightT>(
            tm.mysql.boolean(),
            [left, right],
            OperatorNodeUtil.operatorNode2<OperatorTypeT>(
                operatorType,
                [
                    BuiltInExprUtil.buildAst(left),
                    BuiltInExprUtil.buildAst(right),
                ],
                typeHint
            )
        );
    };
    return result;
}
