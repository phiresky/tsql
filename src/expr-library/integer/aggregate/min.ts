import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const minImpl = makeOperator2<OperatorType.AGGREGATE_MIN, boolean, bigint, bigint|null>(
    OperatorType.AGGREGATE_MIN,
    tm.mysql.bigIntSigned().orNull(),
    TypeHint.BIGINT_SIGNED
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : Operator1<bigint, bigint|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint|null, ArgT>
) => {
    return minImpl(true, arg);
};

export const minAll : Operator1<bigint, bigint|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint|null, ArgT>
) => {
    return minImpl(false, arg);
};

export const min = minAll;