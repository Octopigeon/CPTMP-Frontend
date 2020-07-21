import {NavigationNode} from "../types/nav.model";

export type SidebarEntries = Map<string, string>

/**
 * 左侧导航框的内容，children代表子项
 */

export const AdminNodes: NavigationNode[] = [{
  title: "系统管理",
  tooltip: "对系统进行管理",
  hidden: false,
  children: [{
    title: "用户管理",
    url: "/plat/account",
    tooltip: "对用户进行管理",
    hidden: false
  }, {
    title: "组织管理",
    url: "/plat/org",
    tooltip: "对组织进行管理",
    hidden: false,
  }]
},{
  title: "实训管理",
  tooltip: "对实训进行管理",
  hidden: false,
  children: [{
    title: "实训管理",
    url: "/plat/train",
    tooltip: "对实训进行管理",
    hidden: false
  }, {
    title: "项目管理",
    tooltip: "对组织进行管理",
    hidden: false,
    children: [{
      title: "查看项目",
      url: "/plat/project",
      tooltip: "对项目进行管理",
      hidden: false
    }, {
      title: "项目列表",
      url: "/plat/projectList",
      tooltip: "查看项目列表",
      hidden: false,
    },{
      title: "项目详细",
      url: "/plat/project/detail",
      tooltip: "查看项目详细信息",
      hidden: false,
    }]
  },{
    title: "团队管理",
    tooltip: "对团队进行管理",
    hidden: false,
    children: [{
      title: "查看团队",
      url: "/plat/team",
      tooltip: "对团队进行管理",
      hidden: false
    }, {
      title: "团队列表",
      url: "/plat/teamList",
      tooltip: "查看团队列表",
      hidden: false,
    },{
      title: "团队详细",
      url: "/plat/team/detail",
      tooltip: "查看团队详细信息",
      hidden: false,
    }]
  }]
}, {
  title: "个人账户",
  tooltip: "控制当前账户的设置",
  hidden: false,
  children: [{
    title: "个人信息",
    url: "/plat/user/me",
    tooltip: "查看和修改您的个人信息",
    hidden: false
  }, {
    title: "消息通知",
    url: "/plat/user/message",
    tooltip: "查看您的消息",
    hidden: false
  }, {
    title: "退出登录",
    url: "/plat/user/logout",
    tooltip: "退出当前帐户",
    hidden: false,
  }]
}]
