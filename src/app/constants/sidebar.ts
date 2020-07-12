import {NavigationNode} from "../types/nav.model";

export type SidebarEntries = Map<string, string>

export const AdminNodes: NavigationNode[] = [{
  title: "账户设置",
  tooltip: "控制当前账户的设置",
  hidden: false,
  children: [{
    title: "个人信息",
    url: "/plat/user/me",
    tooltip: "查看和修改您的个人信息",
    hidden: false
  }, {
    title: "占位",
    tooltip: "占位",
    hidden: false,
  }]
}, {
  title: "占位",
  tooltip: "占位",
  hidden: false,
}]
