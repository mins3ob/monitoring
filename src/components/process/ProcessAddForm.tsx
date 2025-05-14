'use client';

import React, { useState } from 'react';
import LabelInput from '@components/inputs/LabelInput';
import EditModal from '@components/EditModal';
import { IProcess } from '@interfaces/index';

interface IProcessAddForm {
  back: () => void;
  projectId: string;
  process?: IProcess | null;
}

export default function ProcessAddForm({
  back,
  projectId,
  process: initialProcess,
}: IProcessAddForm) {
  const [process, setProcess] = useState<IProcess>({
    id: initialProcess?.id || '',
    name: initialProcess?.name || '',
    description: initialProcess?.description || '',
    type: initialProcess?.type || '',
    imageUrl: initialProcess?.imageUrl || null,
    order: initialProcess?.order || 0,
    barcode: initialProcess?.barcode || '',
    project: projectId,
    createdAt: initialProcess?.createdAt || new Date().toISOString(),
    updatedAt: initialProcess?.updatedAt || new Date().toISOString(),
  });

  const handleChange =
    (field: keyof IProcess) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setProcess(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (): void => {
    // TODO: API 호출하여 공정 추가/수정
    console.log('Process Data:', process);
    back();
  };

  const handleDelete = (): void => {
    // TODO: API 호출하여 공정 삭제
    console.log('Delete Process:', process.id);
    back();
  };

  return (
    <EditModal
      back={back}
      title={initialProcess ? '공정 수정' : '공정 추가'}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mode={initialProcess ? 'edit' : 'create'}
    >
      <div className="space-y-4">
        <LabelInput
          label="이름"
          value={process.name}
          onChange={handleChange('name')}
          placeholder="이름을 입력하세요"
        />

        <LabelInput
          label="바코드"
          value={process.barcode}
          onChange={handleChange('barcode')}
          placeholder="바코드를 입력하세요"
        />

        <LabelInput
          label="설명"
          value={process.description}
          onChange={handleChange('description')}
          placeholder="설명을 입력하세요"
        />
      </div>
    </EditModal>
  );
}
