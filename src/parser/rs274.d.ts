export interface TreeNode {
  text: string;
  offset: number;
  elements: TreeNode[];
}
export type TreeNodeAction<T> = (input: string, start: number, end: number, elements: TreeNode[]) => T;
export declare function parse<T extends TreeNode, U = TreeNode>(input: string, options?: {
  actions?: { [key: string]: TreeNodeAction<T> };
  types?: { [key: string]: { [key: string]: Function }};
}): U;