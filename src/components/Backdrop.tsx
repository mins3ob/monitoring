'use client';

import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import { hideBackdrop } from '@redux/slices/backdropSlice';

export default function Backdrop() {
  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  return (
    <button
      type="button"
      onClick={() => dispatch(hideBackdrop())}
      style={{
        display: isVisible ? 'flex' : 'none',
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        borderRadius: 0,
      }}
    ></button>
  );
}
