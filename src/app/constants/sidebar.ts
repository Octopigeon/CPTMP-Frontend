import {NavigationNode} from "../types/nav.model";

export type SidebarEntries = Map<string, string>

export const AdminNodes: NavigationNode[] = [{
  title: "Module1",
  url: "#",
  tooltip: "Note for module1",
  hidden: false
}, {
  title: "Module2",
  tooltip: "Note for module2",
  hidden: false,
  children: [{
    title: "SubModule1",
    url: "#",
    tooltip: "Note for module1",
    hidden: false
  }, {
    title: "SubModule2",
    url: "#",
    tooltip: "Note for module2",
    hidden: false
  }, {
    title: "SubModule3",
    tooltip: "Note for module3",
    hidden: false,
    children: [{
      title: "SubSubModule1",
      url: "#",
      tooltip: "Note for module1",
      hidden: false
    }, {
      title: "SubSubModule2",
      url: "#",
      tooltip: "Note for module1",
      hidden: false
    }]
  }]
}, {
  title: "Module3",
  url: "#",
  tooltip: "Note for module3",
  hidden: false
}, {
  title: "Module4",
  url: "#",
  tooltip: "Note for module4",
  hidden: false
}, {
  title: "Module5",
  url: "#",
  tooltip: "Note for module5",
  hidden: false
}, {
  title: "Module6",
  url: "#",
  tooltip: "Note for module6",
  hidden: false
}]
