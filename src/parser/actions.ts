import { joinElementText, ifBlankTreeNodeSetNull, isBlankTreeNode, isTreeNode } from './utils';

export enum TokenType {
  Line = 'line',
  LineNumber = 'line_number',
  Segment = "segment",
  MidlineWord = 'mid_line_word',
  Text = 'text',
  Expression = 'expression',
  RealNumber = 'real_number',
  GetParameterValue = 'get_parameter_value',
  OrdinaryUnaryCombo = 'ordinary_unary_combo',
  ArcTangentCombo = 'arc_tangent_combo',
  SetParameterValue = 'set_parameter_value',
  PartialBinaryOperation = 'partial_binary_operation',
  BinaryOperation = 'binary_operation',
  BinaryOperator = 'binary_operator',
  Comment = 'comment',
  Message = "message"
}

interface Block {
  type: TokenType;
  [key: string]: any; // TODO: remove this after debugging
}

export interface LineBlock extends Block {
  type: TokenType;
  blockDelete: any;
  lineNumber: LineNumberBlock;
  segments: SegmentBlock[];
}

export type SegmentBlock = MidlineWordBlock;

export interface LineNumberBlock extends Block {
  line: number;
}

export interface MidlineWordBlock extends Block {
  code: string;
  value: RealValueBlock;
}

type RealValueBlock = RealNumberBlock | ExpressionBlock | GetParameterValueBlock | UnaryOperationBlock | BinaryOperationBlock | ArcTangentBlock;

export interface RealNumberBlock extends Block {
  value: number;
}

export interface ExpressionBlock extends Block {
  value: RealValueBlock;
}

export interface GetParameterValueBlock extends Block {
  /** Parameter must evaluate to integer from 1-5399. */
  parameter: RealValueBlock;
}

export interface UnaryOperationBlock extends Block {
  /** Operator: "abs", "acos", "asin", "cos", "exp", "fix", "fup", "ln", "round", "sin", "sqrt", "tan" */
  operator: string;
  expression: ExpressionBlock;
}

export interface ArcTangentBlock extends Block {
  numeratorExpr: ExpressionBlock;
  denominatorExpr: ExpressionBlock;
}

export interface BinaryOperationBlock extends Block {
  operator: BinaryOperatorBlock;
  leftValue: RealValueBlock;
  rightValue: RealValueBlock;
}

interface PartialBinaryOperationBlock extends Block {
  operator: BinaryOperatorBlock;
  value: RealValueBlock;
}

export interface BinaryOperatorBlock extends Block {
  operator: string;
  /** Precedence is 0-2, where 0 is processed before 1, and 1 is processed before 2. */
  precedence: number;
}

export function make_line (input: string, start: number, end: number, elements: any[]): LineBlock { // eslint-disable-line
  const [blockDelNode, lineNumNode, segmentNode] = elements.map(ifBlankTreeNodeSetNull);
  return {
    type: TokenType.Line,
    blockDelete: blockDelNode,
    lineNumber: lineNumNode,
    segments: segmentNode.elements
  };
}

export function make_line_number (input: string, start: number, end: number, elements: any[]): LineNumberBlock { // eslint-disable-line
  // line_number <- letter_n digit digit? digit? digit? digit?
  const [, ...digits] = elements;
  const text = joinElementText(digits);
  return {
    type: TokenType.LineNumber,
    line: Number.parseInt(text)
  };
}

export function make_mid_line_word (input: string, start: number, end: number, elements: any[]): MidlineWordBlock { // eslint-disable-line
  // mid_line_word <- mid_line_letter real_value
  const [ letterNode, realValueNode ] = elements;
  return {
    type: TokenType.MidlineWord,
    code: letterNode.text,
    value: realValueNode
  };
}

export function make_real_number (input: string, start: number, end: number, elements: any[]): RealNumberBlock { // eslint-disable-line
  // real_number <- ( "+" / "-" )? ( (digit ( digit )* (".")? ( digit )*) / ("." digit ( digit )*) )
  const text = joinElementText(elements);
  return {
    type: TokenType.RealNumber,
    value: Number.parseFloat(text)
  };
}

function makeBinaryOperator (operator: string): BinaryOperatorBlock {
  let precedence;
  switch (operator) {
    case "**":
      precedence = 0;
      break;
    case "/":
    case "mod":
    case "*":
      precedence = 1;
      break;
    case "and":
    case "xor":
    case "-":
    case "or":
    case "+":
      precedence = 2;
      break;
    default:
      throw new Error(`Undefined binary operation: "${operator}".`);
  }
  return {
    type: TokenType.BinaryOperator,
    operator,
    precedence
  };
}

function makeBinaryOperationNode (operator: BinaryOperatorBlock, leftValue: RealValueBlock, rightValue: RealValueBlock): BinaryOperationBlock {
  return {
    type: TokenType.BinaryOperation,
    operator,
    leftValue,
    rightValue
  };
}

function buildExpressionTree (expressionElements: any): any {
  const [, lhsRealValue, binOpComboNode ] = expressionElements;
  // get the "binary_operation_combo" objects
  const binOpNodes: any[] = (!binOpComboNode || isBlankTreeNode(binOpComboNode))
    ? null
    : binOpComboNode.elements;

  // if no binary ops, just return the real value
  if (!binOpNodes || binOpNodes.length === 0) { return lhsRealValue; }

  const values: RealValueBlock[] = [ lhsRealValue ];
  const operators: BinaryOperatorBlock[] = [];
  const opPrecedences: number[] = [];
  for (let i = 0; i < binOpNodes.length; ++i) {
    const binOpNode = binOpNodes[i];
    if (binOpNode.type && binOpNode.type === TokenType.PartialBinaryOperation) {
      const { operator: binOp, value: realValue } = binOpNode as PartialBinaryOperationBlock;
      // Workaround: for some binary operators like "-", it doesn't quite lex correctly and doesn't always make an operator struct.
      const op = isTreeNode(binOp) ? makeBinaryOperator(binOp.text) : binOp;
      values.push(realValue);
      operators.push(op);
      opPrecedences.push(op.precedence);
    } else {
      throw new Error('Expecting a PartialBinaryOperationBlock.');
    }
  }
  const traversalOrder = opPrecedences.slice().fill(0);

  let idxCounter = 0;
  [0,1,2].forEach((order: number): void => {
    opPrecedences.forEach((precedence: number, opIndex: number): void => {
      if (precedence === order) {
        traversalOrder[opIndex] = idxCounter++;
      }
    });
  });
  
  const firstIdx = traversalOrder.indexOf(0);
  if (firstIdx === -1) { throw new Error('Big problem: nothing to traverse.'); }
  let leftNode: RealValueBlock = values.splice(firstIdx, 1)[0];
  for (let i = 0; i < traversalOrder.length; ++i) {
    const travIdx = traversalOrder.indexOf(i);
    const op = operators[travIdx];
    const value = values[travIdx];
    leftNode = makeBinaryOperationNode(op, leftNode, value);
  }
  return leftNode;
}

export function make_expression (input: string, start: number, end: number, elements: any[]): ExpressionBlock { // eslint-disable-line
  // expression <- "[" real_value ( binary_operation_combo )* "]"
  const expressionNode = buildExpressionTree(elements);
  return {
    type: TokenType.Expression,
    value: expressionNode
  };
}

export function make_get_parameter_value (input: string, start: number, end: number, elements: any[]): GetParameterValueBlock { // eslint-disable-line
  // parameter_value <- "#" real_value
  const [, parameterValue ] = elements;
  return {
    type: TokenType.GetParameterValue,
    parameter: parameterValue
  };
}

export function make_ordinary_unary_combo (input: string, start: number, end: number, elements: any[]): UnaryOperationBlock { // eslint-disable-line
  // ordinary_unary_combo <- ordinary_unary_operation expression
  const [ operationNode, exprNode ] = elements;
  return {
    type: TokenType.OrdinaryUnaryCombo,
    operator: operationNode.text,
    expression: exprNode
  };
}

export function make_arc_tangent_combo (input: string, start: number, end: number, elements: any[]): ArcTangentBlock { // eslint-disable-line
  // arc_tangent_combo <- "atan" expression "/" expression
  const [, exprNode1, , exprNode2 ] = elements;
  return {
    type: TokenType.ArcTangentCombo,
    numeratorExpr: exprNode1,
    denominatorExpr: exprNode2
  };
}

export function make_binary_operation_combo (input: string, start: number, end: number, elements: any[]): PartialBinaryOperationBlock { // eslint-disable-line
  // binary_operation_combo <- ( binary_operation1 / binary_operation2 / binary_operation3 ) real_value
  const [ binOpNode, realValueNode ] = elements;
  return {
    type: TokenType.PartialBinaryOperation,
    operator: binOpNode,
    value: realValueNode
  };
}

export function make_bin_op (input: string, start: number, end: number, elements: any[]): BinaryOperatorBlock { // eslint-disable-line
  return makeBinaryOperator(input.substring(start, end));
}