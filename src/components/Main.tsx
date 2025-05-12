'use client';

import React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '@redux/store';

import SignIn from '@components/auth/SignIn';
import SideNav from '@components/SideNav';
import ContentHeader from '@components/ContentHeader';

export default function Main({ children }: { children: React.ReactNode }) {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <main
      className={
        !isAuth ? 'flex items-center justify-center min-h-screen bg-[var(--gray-100)]' : undefined
      }
      style={
        isAuth ? { width: '100%', display: 'grid', gridTemplateColumns: '160px 1fr' } : undefined
      }
    >
      {!isAuth ? (
        <SignIn />
      ) : (
        <>
          <SideNav />

          <div style={{ background: 'var(--gray-50)' }}>
            <ContentHeader />

            <div style={{ padding: 20 }}>{children}</div>
          </div>
        </>
      )}
    </main>
  );
}
