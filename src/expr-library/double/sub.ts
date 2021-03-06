import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * Returns the subtraction of the double values
 *
 * The precision of the result is not guaranteed.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html#operator_minus
 *
 * -----
 *
 * + MySQL        : `-`
 *   + `-1e308 - 1e308` throws
 *   + `1e308 - -1e308` throws
 * + PostgreSQL   : `-`
 *   + `CAST(-1e308 AS DOUBLE PRECISION) - CAST(1e308 AS DOUBLE PRECISION)` throws
 *   + `CAST(1e308 AS DOUBLE PRECISION) - CAST(-1e308 AS DOUBLE PRECISION)` throws
 * + SQLite       : `-`
 *   + `-1e308 - 1e308 = -Infinity`
 *   + `1e308 - -1e308 = Infinity`
 *
 * -----
 *
 * In SQLite, subtraction with doubles may return `null`,
 * ```sql
 *  SELECT 1e999 - 1e999;
 *  > null
 * ```
 *
 * This particular function will be emulated in SQLite such that
 * it'll throw an error, instead of returning `null`.
 */
export const sub : Operator2<number, number, number> = makeOperator2<OperatorType.SUBTRACTION, number, number, number>(
    OperatorType.SUBTRACTION,
    tm.toUnsafeNumber(),
    TypeHint.DOUBLE
);
