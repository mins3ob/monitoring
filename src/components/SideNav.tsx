'use client';

import React from 'react';

import Styles from './SideNav.module.css';

import { menus } from '@constants/index';

import { IMenu } from '@interfaces/menu';

const MenuItem = ({ menu }: { menu: IMenu }) => {
  return (
    <div className={Styles.menuItem}>
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
      <p style={{ padding: '10px 20px', marginBottom: 20 }}>로고</p>

      {menus.map((menu, idx) => (
        <MenuItem key={idx} menu={menu} />
      ))}
    </div>
  );
}
