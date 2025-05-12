export interface IMenu {
  main: string;
  icon?: React.ReactNode;
  path: string;
  subs?: IMenu[];
}
