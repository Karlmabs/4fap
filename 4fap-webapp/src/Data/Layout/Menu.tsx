import { MenuItem } from "@/Types/LayoutTypes";

export const MenuList: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-8",
    menucontent: "General",
    Items: [
      {
        path: "/dashboard/default_dashboard",
        icon: "home",
        title: "Dashboard",
        type: "link",
      },
      {
        path: "/file_manager",
        icon: "file",
        title: "File Manager",
        type: "link",
      },
    ],
  },
];
