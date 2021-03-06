import * as tm from "type-mapping";
import {makeOperator2, Operator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

/**
 * -----
 *
 * ### `BIGINT SIGNED` too large
 *
 * ```sql
 *  SELECT 9223372036854775807- (-9223372036854775808);
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `BIGINT SIGNED` too small
 *
 * ```sql
 *  SELECT -9223372036854775808 - 9223372036854775807
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `BIGINT UNSIGNED` too large
 *
 * ```sql
 *  SELECT 18446744073709551615 - (-9223372036854775808)
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `BIGINT UNSIGNED`; this is subtracting two `DECIMAL`s.
 * SQLite has no concept of `BIGINT UNSIGNED`; this is subtracting two `DOUBLE`s.
 *
 * -----
 *
 * ### `BIGINT UNSIGNED` too small
 *
 * ```sql
 *  SELECT 18446744073709551615 - 9223372036854775807 - 9223372036854775807 - 9223372036854775807
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `BIGINT UNSIGNED`; this is of type `DECIMAL`.
 * SQLite has no concept of `BIGINT UNSIGNED`; this is of type `DOUBLE`.
 * -----
 *
 * ### Ensuring consistent behaviour
 *
 * PostgreSQL's behaviour is perfect for `BIGINT SIGNED`.
 *
 * MySQL's behaviour is perfect for `BIGINT SIGNED`.
 *
 * To ensure consistent behaviour across DBMS, **do not** use `BIGINT UNSIGNED` for math.
 * It is fine to use it as an auto-increment identifier in MySQL.
 * Just don't perform math on it.
 *
 * SQLite should have a special `bigintSub()` polyfill that does not cast to `DOUBLE`
 * and throws an error on overflow.
 */
export const sub : Operator2<bigint, bigint, bigint> = makeOperator2<OperatorType.SUBTRACTION, bigint, bigint, bigint>(
    OperatorType.SUBTRACTION,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
