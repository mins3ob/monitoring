'use client';

import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import CSS from './SideNav.module.css';

import { selectMenu } from '@redux/slices/sideNavSlice';

import { menus } from '@constants/index';

import { IMenu } from '@interfaces/menu';

const MenuItem = ({ menu }: { menu: IMenu }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedMenu } = useSelector((state: RootState) => state.sideNav);

  return (
    <div className={CSS.menuItem}>
      <button type="button" onClick={() => dispatch(selectMenu(menu.value!))}>
        {menu.icon && menu.icon}

        <p style={{ fontSize: 16 }}>{menu.main}</p>
      </button>

      {menu.subs && menu.subs.length > 0 && (
        <div
          style={{
            overflow: 'hidden',
            height: selectedMenu === menu.value ? 'auto' : 0,
          }}
        >
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
