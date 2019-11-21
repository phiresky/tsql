import * as tm from "type-mapping";
import {isDataType} from "../predicate";
import {PrimitiveExprUtil} from "../../../primitive-expr";
import {RawExprNoUsedRef_Output} from "../../../raw-expr";
import {IAnonymousColumn, ColumnUtil} from "../../../column";

/**
 * If `mapper` is `IDataType`, it uses `mapper.toRawExpr()`.
 *
 * Else, it uses a fallback algorithm that works fine for `PrimitiveExpr`.
 * If the `value` is not a `PrimitiveExpr`, an error is thrown.
 */
export function toRawExpr<TypeT> (
    mapper : tm.SafeMapper<TypeT>|IAnonymousColumn<TypeT>,
    value : TypeT
) : RawExprNoUsedRef_Output<TypeT> {
    let valueName = "literal-value";

    if (ColumnUtil.isColumn(mapper)) {
        /**
         * @todo Investigate bug
         * ```ts
         * mapper = mapper.mapper;
         * valueName = `${mapper.tableAlias}${mapper.columnAlias}`; //This gives an error
         * ```
         */
        valueName = `${mapper.tableAlias}${mapper.columnAlias}`;
        mapper = mapper.mapper;
    }
    if (isDataType(mapper)) {
        return mapper.toRawExpr(
            /**
             * Validate the incoming value again, just to be sure...
             */
            mapper(valueName, value)
        );
    } else {
        if (PrimitiveExprUtil.isPrimitiveExpr(value)) {
            return mapper(valueName, value) as RawExprNoUsedRef_Output<TypeT>;
        } else {
            /**
             * @todo Custom `Error` type
             */
            throw new Error(`Don't know how to convert ${tm.TypeUtil.toTypeStr(value)} value with keys ${Object.keys(value).map(k => JSON.stringify(k)).join(", ")} to RawExpr`);
        }
    }
}