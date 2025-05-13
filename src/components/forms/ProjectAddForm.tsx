'use client';

import React, { useState } from 'react';

import LabelInput from '@components/inputs/LabelInput';

import { IProject } from '@interfaces/index';

interface IProjectAddForm {
  back: () => void;
}

export default function ProjectAddForm({ back }: IProjectAddForm) {
  const [project, setProject] = useState<IProject>({
    id: '',
    name: '',
    status: '대기중',
    imageUrl: null,
    description: '',
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    event: '',
    carType: '',
    part: '',
    feature: '',
    quantity: '',
  });

  const handleChange =
    (field: keyof IProject) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = field === 'quantity' ? Number(e.target.value) : e.target.value;
      setProject(prev => ({
        ...prev,
        [field]: value,
      }));
    };

  const clickBack = (): void => {
    back();
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4"
      style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <h4>프로젝트 추가/수정/삭제</h4>

      <LabelInput
        label="프로젝트명"
        value={project.name}
        onChange={handleChange('name')}
        placeholder="프로젝트명을 입력하세요"
      />

      <LabelInput
        label="차종"
        value={project.carType}
        onChange={handleChange('carType')}
        placeholder="차종을 입력하세요"
      />

      <LabelInput
        label="부품"
        value={project.part}
        onChange={handleChange('part')}
        placeholder="부품을 입력하세요"
      />

      <LabelInput
        label="사양"
        value={project.feature}
        onChange={handleChange('feature')}
        placeholder="사양을 입력하세요"
      />

      <LabelInput
        label="이벤트"
        value={project.event}
        onChange={handleChange('event')}
        placeholder="이벤트를 입력하세요"
      />

      <LabelInput
        label="시작일"
        type="date"
        value={project.startDate}
        onChange={handleChange('startDate')}
        placeholder="시작일을 입력하세요"
      />

      <LabelInput
        label="종료일"
        type="date"
        value={project.endDate}
        onChange={handleChange('endDate')}
        placeholder="종료일을 입력하세요"
      />

      <LabelInput
        label="수량"
        type="number"
        value={project.quantity?.toString() ?? '0'}
        onChange={handleChange('quantity')}
        placeholder="수량을 입력하세요"
      />

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
