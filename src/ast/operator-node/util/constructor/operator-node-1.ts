import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand1} from "../predicate";
import {Operand1} from "../../operand";
import {TypeHint} from "../../../../type-hint";

export function operatorNode1<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand1<OperatorTypeT>,
    operands : Operand1,
    typeHint : TypeHint|undefined
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
        typeHint,
    };
}
