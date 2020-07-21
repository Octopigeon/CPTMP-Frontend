export interface NavigationNode {
  // NOTE:
  // A navigation node should always have a title (to display to the user).
  // It may also have `url` (if it is a leaf node) or `children` (and no `url`), but it should
  // always have `title`.
  title: string;

  url?: string;
  tooltip?: string;
  hidden?: boolean;
  children?: NavigationNode[];
}

/**
 *  Navigation information about a node at specific URL
 *  url: the current URL
 *  nodes: the current node and its ancestor nodes within that view
 */
export interface CurrentNode {
  url: string;
  nodes: NavigationNode[];
}

