'use client';

import React from 'react';

interface IModal {
  children?: React.ReactNode;
}

export default function Modal({ children }: IModal) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--gray-100)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}
