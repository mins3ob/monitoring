'use client';

import React from 'react';

type EditMode = 'create' | 'edit';

interface IEditModal {
  back: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  mode?: EditMode;
  title: string;
  children: React.ReactNode;
}

export default function EditModal({
  back,
  title,
  onSubmit,
  onDelete,
  mode = 'create',
  children,
}: IEditModal) {
  const submitButtonText = mode === 'create' ? '등록' : '수정';

  return (
    <div
      className="space-y-4 p-4"
      style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <h4>{title}</h4>

      {children}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" onClick={back} className="reverseBtn">
          취소
        </button>

        <button type="button" onClick={onSubmit}>
          {submitButtonText}
        </button>

        {mode === 'edit' && (
          <button type="button" onClick={onDelete} className="deleteBtn">
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
