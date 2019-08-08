import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_or
 *
 * This version of the `OR` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link or3}
 */
export const or : ChainableOperator<boolean> = makeChainableOperator<boolean>(
    "OR",
    false,
    tm.mysql.boolean()
);
