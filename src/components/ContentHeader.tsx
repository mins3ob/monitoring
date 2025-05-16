'use client';

import React, { useState } from 'react';
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { resetAuth } from '@redux/slices/authSlice';

export default function ContentHeader() {
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: 10,
        padding: 10,
      }}
    >
      <div style={{ height: 35 }}>
        <button
          type="button"
          onClick={() => setIsProfileOpen(prev => !prev)}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <UserCircleIcon className="w-10 h-10 text-gray-600" />
        </button>

        {isProfileOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              padding: 20,
              background: 'white',
            }}
          >
            <h6 style={{ marginBottom: 20 }}>
              {auth.email ? auth.email.split('@')[0] : '정보없음'} 님
            </h6>

            <button type="button" onClick={() => dispatch(resetAuth())}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      <div style={{ height: 35 }}>
        <button type="button" style={{ background: 'none', border: 'none', padding: 0 }}>
          <Cog6ToothIcon className="w-10 h-10 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
