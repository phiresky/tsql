import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
/**
 * -----
 *
 * ### `BIGINT SIGNED` too large
 *
 * ```sql
 *  SELECT 9223372036854775807*9223372036854775807;
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `BIGINT SIGNED` too small
 *
 * ```sql
 *  SELECT 9223372036854775807*-9223372036854775808
 * ```
 * The above throws an error on both MySQL and PostgreSQL.
 * SQLite casts to a `DOUBLE`.
 *
 * -----
 *
 * ### `BIGINT UNSIGNED` too large
 *
 * ```sql
 *  SELECT 18446744073709551615*18446744073709551615
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `BIGINT UNSIGNED`; this is multiplying two `DECIMAL`s.
 * SQLite has no concept of `BIGINT UNSIGNED`; this is multiplying two `DOUBLE`s.
 *
 * -----
 *
 * ### `BIGINT UNSIGNED` too small
 *
 * ```sql
 *  SELECT 18446744073709551615 * -9223372036854775808
 * ```
 * MySQL throws an error.
 * PostgreSQL has no concept of `BIGINT UNSIGNED`; this is of type `DECIMAL`.
 * SQLite has no concept of `BIGINT UNSIGNED`; this is of type `DOUBLE`.
 *
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
 * SQLite should have a special `bigintMul()` polyfill that does not cast to `DOUBLE`
 * and throws an error on overflow.
 */
export const mul : ChainableOperator<bigint> = makeChainableOperator<OperatorType.MULTIPLICATION, bigint>(
    OperatorType.MULTIPLICATION,
    tm.BigInt(1),
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
