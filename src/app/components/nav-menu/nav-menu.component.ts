import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CurrentNode, NavigationNode} from "../../constants/nav.model";

@Component({
  selector: 'nav-menu',
  template: `
  <nav-item *ngFor="let node of filteredNodes" [node]="node" [selectedNodes]="currentNode?.nodes" [isWide]="isWide">
  </nav-item>`,
  styleUrls: ['./nav-menu.component.styl'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent {
  @Input() currentNode: CurrentNode | undefined;
  @Input() isWide = false;
  @Input() nodes: NavigationNode[];
  get filteredNodes() { return this.nodes ? this.nodes.filter(n => !n.hidden) : []; }
}
