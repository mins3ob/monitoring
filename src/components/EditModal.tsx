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
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h4 className="text-xl font-semibold text-gray-800 mb-6" style={{ marginBottom: 20 }}>
        {title}
      </h4>

      <div className="space-y-4">{children}</div>

      <div className="flex justify-end gap-3 mt-20 pt-4 " style={{ marginTop: 20 }}>
        <button type="button" onClick={back}>
          취소
        </button>

        <button type="button" onClick={onSubmit} className="reverseBtn">
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
