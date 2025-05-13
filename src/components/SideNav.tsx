'use client';

import React from 'react';

import styles from './SideNav.module.css';

import { menus } from '@constants/index';

import { IMenu } from '@interfaces/menu';

import IconHwashingLogo from '@public/svgs/common/icon_hwashing_logo.svg';

const MenuItem = ({ menu }: { menu: IMenu }) => {
  return (
    <div className={styles.menuItem}>
      <button
        type="button"
        onClick={() => {
          window.location.href = `${menu.path}`;
        }}
      >
        {menu.icon && menu.icon}

        <p style={{ fontSize: 16 }}>{menu.main}</p>
      </button>

      {menu.subs && menu.subs.length > 0 && (
        <div style={{ overflow: 'hidden' }}>
          {menu.subs && menu.subs.length > 0 && (
            <div>
              {menu.subs.map((subMenu, idx) => (
                <MenuItem key={idx} menu={subMenu} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SideNav() {
  return (
    <div style={{ height: '100vh' }}>
      <p style={{ padding: 20, marginBottom: 20 }}>
        <IconHwashingLogo
          width={100}
          height={16.24}
          style={{ cursor: 'pointer' }}
          onClick={() => (window.location.href = '/')}
        />
      </p>

      {menus.map((menu, idx) => (
        <MenuItem key={idx} menu={menu} />
      ))}
    </div>
  );
}
