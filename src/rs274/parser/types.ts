export enum TokenType {
  BlockDelete = 'block_delete',
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

interface LexerBlock {
  type: TokenType;
  [key: string]: any; // TODO: remove this after debugging
}

export interface BlockDeleteBlock extends LexerBlock {
  value: boolean;
}

export interface LineBlock extends LexerBlock {
  blockDelete: BlockDeleteBlock;
  lineNumber: LineNumberBlock;
  segments: SegmentBlock[];
}

export type SegmentBlock = MidlineWordBlock;

export interface LineNumberBlock extends LexerBlock {
  line: number;
}

export interface MidlineWordBlock extends LexerBlock {
  code: string;
  value: RealValueBlock;
}

export type RealValueBlock = RealNumberBlock | ExpressionBlock | GetParameterValueBlock | UnaryOperationBlock | BinaryOperationBlock | ArcTangentBlock;

export interface RealNumberBlock extends LexerBlock {
  value: number;
}

export interface ExpressionBlock extends LexerBlock {
  value: RealValueBlock;
}

export interface GetParameterValueBlock extends LexerBlock {
  /** Parameter must evaluate to integer from 1-5399. */
  parameter: RealValueBlock;
}

export interface UnaryOperationBlock extends LexerBlock {
  /** Operator: "abs", "acos", "asin", "cos", "exp", "fix", "fup", "ln", "round", "sin", "sqrt", "tan" */
  operator: string;
  expression: ExpressionBlock;
}

export interface ArcTangentBlock extends LexerBlock {
  numeratorExpr: ExpressionBlock;
  denominatorExpr: ExpressionBlock;
}

export interface BinaryOperationBlock extends LexerBlock {
  operator: BinaryOperatorBlock;
  leftValue: RealValueBlock;
  rightValue: RealValueBlock;
}

export interface PartialBinaryOperationBlock extends LexerBlock {
  operator: BinaryOperatorBlock;
  value: RealValueBlock;
}

export interface BinaryOperatorBlock extends LexerBlock {
  operator: string;
  /** Precedence is 0-2, where 0 is processed before 1, and 1 is processed before 2. */
  precedence: number;
}

export interface SetParameterValueBlock extends LexerBlock {
  parameter: RealValueBlock;
  value: RealValueBlock;
}

export interface CommentBlock extends LexerBlock {
  comment: string;
}

export interface MessageBlock extends LexerBlock {
  message: string;
}