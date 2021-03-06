import {makeNullSafeEquation1, NullSafeEquation1} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_is-null
 *
 * Tests whether a value is NULL.
 *
 * ```sql
 * mysql> SELECT (1 IS NULL), (0 IS NULL), (NULL IS NULL);
 *         -> 0, 0, 1
 * ```
 */
export const isNull : NullSafeEquation1 = makeNullSafeEquation1(
    OperatorType.IS_NULL
);
