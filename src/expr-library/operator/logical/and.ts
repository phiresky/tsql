import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html#operator_and
 *
 * This version of the `AND` operator forbids `NULL`.
 *
 * For three-valued logic, @see {@link and3}
 */
export const and : ChainableOperator<boolean> = makeChainableOperator<boolean>(
    "AND",
    true,
    tm.mysql.boolean()
);
