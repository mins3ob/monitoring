import { IMenu } from '@interfaces/menu';

export const menus: IMenu[] = [
  {
    main: '대시보드',
    path: '/',
  },
  {
    main: '프로젝트',
    path: '/project',
    // subs: [
    //   {
    //     main: "공정",
    //     path: "process",
    //   },
    //   {
    //     main: "LOT",
    //     path: "lot",
    //   },
    //   { main: "통계", path: "statistics" },
    // ],
  },
  {
    main: '공정',
    path: '/process',
  },
  { main: '통계', path: '/statistics' },
  {
    main: '사용자',
    path: '/users',
  },
  {
    main: '재고',
    path: '/inventory',
  },
];

export const monthlyLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
