import {Parentheses} from "./parentheses";
import {FunctionCall} from "./function-call";
import {OperatorNode} from "./operator-node";
import {IdentifierNode} from "./identifier-node";
import {IQueryBase} from "../query-base";

export interface AstArray extends ReadonlyArray<Ast> {
}
export type Ast =
    /**
     * A string literal that will not be escaped
     */
    | string
    /**
     * An array of AST
     */
    | AstArray
    /**
     * Adds parentheses around an AST
     */
    | Parentheses
    /**
     * @todo Description
     */
    | FunctionCall
    /**
     * @todo Description
     */
    | OperatorNode
    /**
     * @todo Description
     */
    | IdentifierNode
    | IQueryBase
;
