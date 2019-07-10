import { parse, TreeNode } from './rs274'; // eslint-disable-line @typescript-eslint/no-var-requires

function removeBlankTreeEntries (treeNode: TreeNode): void {
  const els = treeNode.elements;
  const n = els.length;
  if (n === 0) {
    return;
  } else {
    for (let i = n - 1; i >= 0; --i) {
      const el = els[i];
      if (el.text === "") {
        els.splice(i, 1);
      } else {
        removeBlankTreeEntries(el);
      }
    }
  }
}

interface RS274TreeNode extends TreeNode {
  type: string;
}

export const parseLine = (line: string): TreeNode => {
  const parsedTree: TreeNode = parse(line);
  removeBlankTreeEntries(parsedTree);
  return parsedTree;
};