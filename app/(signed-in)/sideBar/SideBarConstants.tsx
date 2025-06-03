import {
  AlignLeft,
  ChatsCircle,
  Files,
  SquaresFour,
} from "@phosphor-icons/react";

export interface ISideBarItem {
  title: string;
  path: string;
  icon?: JSX.Element;
}
const SideBarItems: ISideBarItem[] = [
  {
    title: "Discuss",
    path: "/discussion",
    icon: (
      <ChatsCircle
        size={20}
        color={"#65636D"}
        className="group-hover/menuItem:fill-purple-1100"
      />
    ),
  },
  {
    title: "Dashboard",
    path: "/home",

    icon: (
      <SquaresFour
        size={20}
        color="#65636D"
        className="group-hover/menuItem:fill-purple-1100"
      />
    ),
  },
  {
    title: "Planner",
    path: "/planner",

    icon: (
      <AlignLeft
        size={20}
        color="#65636D"
        className="group-hover/menuItem:fill-purple-1100"
      />
    ),
  },
  {
    title: "Docs",
    path: "/",

    icon: (
      <Files
        size={20}
        color="#65636D"
        className="group-hover/menuItem:fill-purple-1100"
      />
    ),
  },
];

export default SideBarItems;
