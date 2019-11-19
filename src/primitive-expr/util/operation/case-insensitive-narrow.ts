import {NonNullPrimitiveExpr} from "../../primitive-expr";
import {NonNullPrimitiveType} from "../query";

/**
 * Assuming case-insensitive equality,
 * + You cannot narrow `string` to a `string-literal`
 *
 *   Given`x = 'HeLlO'`,
 *   `x` could be `'hello'` or `'HELLO'`
 *
 * + You cannot narrow `Uint8Array` to a `Uint8Array-literal`
 *
 *   There is no `Uint8Array-literal` type
 *
 * + You cannot narrow `Date` to a `Date-literal`
 *
 *   There is no `Date-literal` type
 *
 */
export type CaseInsensitiveNarrow<
    A extends NonNullPrimitiveExpr,
    B extends A
> = (
    Extract<A, string|Uint8Array|Date> extends never ?
    B :
    NonNullPrimitiveType<B>
);
