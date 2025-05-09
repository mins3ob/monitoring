import { IMenu } from "@interfaces/menu";

export const menus: IMenu[] = [
  {
    main: "대시보드",
    value: "dashboard",
  },
  {
    main: "프로젝트",
    value: "project",
    // subs: [
    //   {
    //     main: "공정",
    //     value: "process",
    //   },
    //   {
    //     main: "LOT",
    //     value: "lot",
    //   },
    //   { main: "통계", value: "statistics" },
    // ],
  },
  {
    main: "공정",
    value: "process",
  },
  {
    main: "LOT",
    value: "lot",
  },
  { main: "통계", value: "statistics" },
  {
    main: "사용자",
    value: "users",
  },
  {
    main: "재고",
    value: "inventory",
  },
];

export const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
