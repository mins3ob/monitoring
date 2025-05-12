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
    imgUrl: null,
    description: '',
    lot: 0,
    success: 0,
    failed: 0,
    processIds: [],
    carType: '',
    parts: '',
    specification: '',
    event: '',
    schedule: '',
    quantity: 0,
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
      style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 20 }}
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
        value={project.parts}
        onChange={handleChange('parts')}
        placeholder="부품을 입력하세요"
      />

      <LabelInput
        label="사양"
        value={project.specification}
        onChange={handleChange('specification')}
        placeholder="사양을 입력하세요"
      />

      <LabelInput
        label="이벤트"
        value={project.event}
        onChange={handleChange('event')}
        placeholder="이벤트를 입력하세요"
      />

      <LabelInput
        label="일정"
        value={project.schedule}
        onChange={handleChange('schedule')}
        placeholder="일정을 입력하세요"
      />

      <LabelInput
        label="수량"
        type="number"
        value={project.quantity?.toString() ?? '0'}
        onChange={handleChange('quantity')}
        placeholder="수량을 입력하세요"
      />

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={clickBack}
          style={{
            background: 'white',
            border: '1px solid var(--primary-color)',
            color: 'var(--primary-color)',
          }}
        >
          취소
        </button>

        <button type="button">등록 / 수정</button>

        <button type="button" style={{ background: 'red' }}>
          삭제
        </button>
      </div>
    </form>
  );
}
