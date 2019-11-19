import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {Ast, parentheses, LiteralValueNodeUtil} from "../../../ast";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryBaseUtil} from "../../../query-base";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {isDate} from "../../../date-util";

/**
 * + `bigint` is considered a `signed bigint` by this library.
 * +`DECIMAL` is not supported by this function.
 * +`UNSIGNED BIGINT` is not supported by this function.
 */
export function buildAst (rawExpr : AnyRawExpr|QueryBaseUtil.OneSelectItem<any>) : Ast {
    //Check primitive cases first
    if (typeof rawExpr == "number") {
        return LiteralValueNodeUtil.doubleLiteralNode(rawExpr);
    }
    if (tm.TypeUtil.isBigInt(rawExpr)) {
        return LiteralValueNodeUtil.signedBigIntLiteralNode(rawExpr);
    }
    if (typeof rawExpr == "string") {
        return LiteralValueNodeUtil.stringLiteralNode(rawExpr);
    }
    if (typeof rawExpr == "boolean") {
        return LiteralValueNodeUtil.booleanLiteralNode(rawExpr);
    }
    if (isDate(rawExpr)) {
        return LiteralValueNodeUtil.dateTimeLiteralNode(rawExpr);
    }
    if (rawExpr instanceof Uint8Array) {
        //escape(Buffer.from("hello")) == "X'68656c6c6f'"
        return LiteralValueNodeUtil.bufferLiteralNode(rawExpr);
    }
    if (rawExpr === null) {
        return LiteralValueNodeUtil.nullLiteralNode(rawExpr);
    }

    if (ExprUtil.isExpr(rawExpr)) {
        return rawExpr.ast;
    }

    if (ColumnUtil.isColumn(rawExpr)) {
        return ColumnUtil.buildAst(rawExpr);
    }

    if (QueryBaseUtil.isOneSelectItem(rawExpr)) {
        /**
         * @todo Check if this is desirable
         */
        //return rawExpr.buildExprAst();
        return parentheses(rawExpr, false/*canUnwrap*/);
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        /**
         * @todo Check if this is desirable.
         * If anything, the `query` ast, when used as a value query,
         * should wrap an unwrappable parentheses around itself.
         */
        //return Parentheses.Create(rawExpr.unaliasedAst, false/*canUnwrap*/);
        return parentheses(rawExpr.unaliasedAst);
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
