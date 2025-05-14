'use client';

import React, { useState } from 'react';
import AutoCompleteDropdownInput from '@components/inputs/AutoCompleteDropdownInput';
import LabelInput from '@components/inputs/LabelInput';
import EditModal from '@components/EditModal';

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

  const handleSubmit = (): void => {
    // 제출 로직 구현
    console.log('Selected Project:', selectedProject);
  };

  const handleDelete = (): void => {
    // 삭제 로직 구현
    console.log('Delete Lot:', lotNumber);
  };

  return (
    <EditModal
      back={back}
      title="LOT 추가"
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mode="create"
    >
      <div className="space-y-4">
        <AutoCompleteDropdownInput
          label="프로젝트"
          options={sampleOptions}
          onSelect={option => setSelectedProject(option.value)}
        />

        <LabelInput
          label="LOT 번호"
          value={lotNumber}
          onChange={e => setLotNumber(e.target.value)}
        />
      </div>
    </EditModal>
  );
}
