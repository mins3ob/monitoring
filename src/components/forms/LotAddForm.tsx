'use client';

import React, { useState } from 'react';

import AutoCompleteDropdownInput from '@components/inputs/AutoCompleteDropdownInput';
import LabelInput from '@components/inputs/LabelInput';

const sampleOptions = [
  { value: 'react' },
  { value: 'next' },
  { value: 'vue' },
  { value: 'angular' },
];

interface ILotAddForm {
  back: () => void;
}

export default function LotAddForm({ back }: ILotAddForm) {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [lotNumber, setLotNumber] = useState<string>('');

  const clickBack = (): void => {
    back();
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Selected Project:', selectedProject);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4"
      style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <h4>LOT 추가</h4>

      <AutoCompleteDropdownInput
        label="프로젝트"
        options={sampleOptions}
        onSelect={option => console.log('Selected:', option)}
      />

      <LabelInput label="LOT 번호" value={lotNumber} onChange={e => setLotNumber(e.target.value)} />

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" onClick={clickBack} className="cancelBtn">
          취소
        </button>

        <button type="button">등록 / 수정</button>

        <button type="button" className="deleteBtn">
          삭제
        </button>
      </div>
    </form>
  );
}
