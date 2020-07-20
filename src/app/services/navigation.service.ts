import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {combineLatest, ConnectableObservable, Observable, ReplaySubject} from 'rxjs';
import { map, publishLast, publishReplay } from 'rxjs/operators';

import { LocationService } from './location.service';
import {CurrentNode, NavigationNode} from "../types/nav.model";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  /**
   * An observable collection of NavigationNode trees, which can be used to render navigational menus
   */
  navigationNodes: ReplaySubject<NavigationNode[]>;


  /**
   * An observable of the current node with info about the
   * node (if any) that matches the current URL location
   * including its navigation view and its ancestor nodes in that view
   */
  currentNodes: Observable<CurrentNode>;

  constructor(private http: HttpClient, private location: LocationService) {
    this.navigationNodes = new ReplaySubject<NavigationNode[]>(1);
    this.updateNavigationView([]);
  }

  public updateNavigationView(nav: NavigationNode[]) {
    this.navigationNodes.next(nav);
    this.currentNodes = this.getCurrentNodes(this.navigationNodes);
  }

  /**
   * Get an observable of the current nodes (the ones that match the current URL)
   * We use `publishReplay(1)` because otherwise subscribers will have to wait until the next
   * URL change before they receive an emission.
   * See above for discussion of using `connect`.
   */
  private getCurrentNodes(navigationNodes: Observable<NavigationNode[]>): Observable<CurrentNode> {
    const currentNodes = combineLatest([
      navigationNodes.pipe(
        map(views => this.computeUrlToNavNodesMap(views))),
      this.location.url$,
    ])
      .pipe(
        map((result) => ({navMap: result[0] , url: result[1]})),
        map((result) => {
          return result.navMap.get(result.url) || {url: result.url, nodes: [] };
        }),
        publishReplay(1));
    (currentNodes as ConnectableObservable<CurrentNode>).connect();
    return currentNodes;
  }

  /**
   * Compute a mapping from URL to an array of nodes, where the first node in the array
   * is the one that matches the URL and the rest are the ancestors of that node.
   *
   * @param navigation - A collection of navigation nodes that are to be mapped
   */
  private computeUrlToNavNodesMap(navigation: NavigationNode[]) {
    const navMap = new Map<string, CurrentNode>();
    navigation.forEach(node => this.walkNodes(navMap, node));
    return navMap;
  }

  /**
   * Add tooltip to node if it doesn't have one and have title.
   * If don't want tooltip, specify `"tooltip": ""` in navigation.json
   */
  private ensureHasTooltip(node: NavigationNode) {
    const title = node.title;
    const tooltip = node.tooltip;
    if (tooltip == null && title ) {
      // add period if no trailing punctuation
      node.tooltip = title + (/[a-zA-Z0-9]$/.test(title) ? '.' : '');
    }
  }
  /**
   * Walk the nodes of a navigation tree-view,
   * patching them and computing their ancestor nodes
   */
  private walkNodes(
    navMap: Map<string, CurrentNode>,
    node: NavigationNode, ancestors: NavigationNode[] = []) {
    const nodes = [node, ...ancestors];
    const url = node.url;
    this.ensureHasTooltip(node);

    // only map to this node if it has a url
    if (url) {
      // Strip off trailing slashes from nodes in the navMap - they are not relevant to matching
      const cleanedUrl = url.replace(/\/$/, '');
      if (!navMap.has(cleanedUrl)) {
        navMap.set(cleanedUrl, {nodes, url});
      }
    }

    if (node.children) {
      node.children.forEach(child => this.walkNodes(navMap, child, nodes));
    }
  }
}
