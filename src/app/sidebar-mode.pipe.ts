import { Pipe, PipeTransform } from '@angular/core';
import {Size} from "./services/env.service";
import {MatDrawerMode} from "@angular/material/sidenav";

@Pipe({
  name: 'sidebarMode'
})
export class SidebarModePipe implements PipeTransform {

  transform(value: Size, ...args: any[]): MatDrawerMode {
    return value === 'desktop' ? 'side' : 'over';
  }

}
