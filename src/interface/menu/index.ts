export interface IMenu {
  main: string;
  icon?: React.ReactNode;
  value: TMenu;
  subs?: IMenu[];
}

export type TMenu = "dashboard" | "project" | "process" | "lot" | "statistics" | "users" | "inventory";
