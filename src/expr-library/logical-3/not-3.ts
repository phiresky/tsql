import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator1DoubleElimination} from "../factory";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_not
 *
 * This version of the `NOT` operator allows `NULL`.
 *
 * For two-valued logic, @see {@link not}
 */
export const not3 = makeOperator1DoubleElimination<OperatorType.NOT, boolean|null, boolean|null>(
    OperatorType.NOT,
    tm.mysql.boolean().orNull()
);
