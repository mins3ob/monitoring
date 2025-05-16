'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, FolderIcon, UsersIcon } from '@heroicons/react/24/outline';

import styles from './SideNav.module.css';

import IconHwashingLogo from '@public/svgs/common/icon_hwashing_logo.svg';

interface IMenu {
  main: string;
  icon?: React.ReactNode;
  path: string;
  subs?: IMenu[];
}

const menus: IMenu[] = [
  {
    main: '대시보드',
    path: '/',
    icon: <HomeIcon width={20} height={20} />,
  },
  {
    main: '프로젝트',
    path: '/project',
    icon: <FolderIcon width={20} height={20} />,
  },
  {
    main: '사용자',
    path: '/users',
    icon: <UsersIcon className="h-5 w-5" />,
  },
];

const MenuItem = ({ menu }: { menu: IMenu }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === menu.path;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (menu.subs && menu.subs.some(sub => pathname.startsWith(sub.path))) {
      setOpen(true);
    }
  }, [pathname, menu.subs]);

  const handleClick = () => {
    if (menu.subs) {
      setOpen(prev => !prev);
    } else {
      router.push(menu.path);
    }
  };

  return (
    <div className={styles.menuItem}>
      <button
        type="button"
        onClick={handleClick}
        className={isActive ? `${styles.menuButton} ${styles.active}` : styles.menuButton}
      >
        <span className={styles.menuIcon}>{menu.icon && menu.icon}</span>
        <span>{menu.main}</span>
      </button>
      {menu.subs && open && (
        <div style={{ overflow: 'hidden', marginLeft: 16 }}>
          <div>
            {menu.subs.map((subMenu, idx) => (
              <MenuItem key={idx} menu={subMenu} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SideNav() {
  return (
    <nav className={styles.sideNav}>
      <div className={styles.logoArea}>
        <IconHwashingLogo
          width={100}
          height={16.24}
          style={{ cursor: 'pointer' }}
          onClick={() => (window.location.href = '/')}
        />
      </div>
      <div className={styles.menuList}>
        {menus.map((menu, idx) => (
          <MenuItem key={idx} menu={menu} />
        ))}
      </div>
    </nav>
  );
}
