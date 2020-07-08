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

export interface NavigationViews {
  [name: string]: NavigationNode[];
}

/**
 *  Navigation information about a node at specific URL
 *  url: the current URL
 *  view: 'SideNav' | 'TopBar' | 'Footer' | etc
 *  nodes: the current node and its ancestor nodes within that view
 */
export interface CurrentNode {
  url: string;
  view: string;
  nodes: NavigationNode[];
}

/**
 * A map of current nodes by view.
 * This is needed because some urls map to nodes in more than one view.
 * If a view does not contain a node that matches the current url then the value will be undefined.
 */
export interface CurrentNodes {
  [view: string]: CurrentNode;
}
