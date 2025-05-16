'use client';

import React, { useState, useEffect } from 'react';
import LabelInput from '@components/inputs/LabelInput';
import EditModal from '@components/EditModal';
import { IProject, IProjectWithStats } from '@interfaces/index';

interface IProjectEditForm {
  back: () => void;
  project?: IProjectWithStats | null;
}

export default function ProjectEditForm({ back, project }: IProjectEditForm) {
  const [projectData, setProjectData] = useState<IProject>({
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
    quantity: 0,
  });

  useEffect(() => {
    if (project) {
      setProjectData({
        id: project.id,
        name: project.name,
        status: project.status,
        imageUrl: project.imageUrl,
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        event: project.event || '',
        carType: project.carType || '',
        part: project.part || '',
        feature: project.feature || '',
        quantity: project.quantity || 0,
      });
    }
  }, [project]);

  const handleChange =
    (field: keyof IProject) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = field === 'quantity' ? Number(e.target.value) : e.target.value;
      setProjectData(prev => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = (): void => {
    // 제출 로직 구현
    console.log('Submit:', projectData);
  };

  const handleDelete = (): void => {
    // 삭제 로직 구현
    console.log('Delete:', projectData.id);
  };

  return (
    <EditModal
      back={back}
      title={project ? '프로젝트 수정/삭제' : '프로젝트 추가'}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mode={project ? 'edit' : 'create'}
    >
      <div className="space-y-4">
        <LabelInput
          label="프로젝트명"
          value={projectData.name}
          onChange={handleChange('name')}
          placeholder="프로젝트명을 입력하세요"
        />

        <LabelInput
          label="차종"
          value={projectData.carType}
          onChange={handleChange('carType')}
          placeholder="차종을 입력하세요"
        />

        <LabelInput
          label="부품"
          value={projectData.part}
          onChange={handleChange('part')}
          placeholder="부품을 입력하세요"
        />

        <LabelInput
          label="사양"
          value={projectData.feature}
          onChange={handleChange('feature')}
          placeholder="사양을 입력하세요"
        />

        <LabelInput
          label="이벤트"
          value={projectData.event}
          onChange={handleChange('event')}
          placeholder="이벤트를 입력하세요"
        />

        <LabelInput
          label="시작일"
          type="date"
          value={projectData.startDate}
          onChange={handleChange('startDate')}
          placeholder="시작일을 입력하세요"
        />

        <LabelInput
          label="종료일"
          type="date"
          value={projectData.endDate}
          onChange={handleChange('endDate')}
          placeholder="종료일을 입력하세요"
        />

        <LabelInput
          label="수량"
          type="number"
          value={projectData.quantity?.toString() ?? '0'}
          onChange={handleChange('quantity')}
          placeholder="수량을 입력하세요"
        />
      </div>
    </EditModal>
  );
}
