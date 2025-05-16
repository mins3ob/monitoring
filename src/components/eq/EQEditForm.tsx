import React, { useState, useEffect } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import EditModal from '@components/EditModal';
import LabelInput from '@components/inputs/LabelInput';
import AutoCompleteDropdownInput from '@components/inputs/AutoCompleteDropdownInput';

interface EQBoard {
  id: string;
  name: string;
  pc: string;
  type: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

interface EQEditFormProps {
  back: () => void;
  eq: EQBoard | null;
  onSubmit: (data: Partial<EQBoard>) => void;
  onDelete?: () => void;
}

export function EQEditForm({ back, eq, onSubmit, onDelete }: EQEditFormProps) {
  const [formData, setFormData] = useState<Partial<EQBoard>>({
    name: '',
    pc: '',
    type: '',
    file_url: '',
  });

  useEffect(() => {
    if (eq) {
      setFormData({
        id: eq.id,
        name: eq.name,
        pc: eq.pc,
        type: eq.type,
        file_url: eq.file_url,
        created_at: eq.created_at,
        updated_at: eq.updated_at,
      });
    }
  }, [eq]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handlePCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      pc: e.target.value,
    }));
  };

  const handleTypeChange = (option: { value: string }) => {
    setFormData(prev => ({
      ...prev,
      type: option.value,
    }));
  };

  const handleFileUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      file_url: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <EditModal
      back={back}
      title={eq ? 'EQ 정보 수정/삭제' : '새 EQ 추가'}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mode={eq ? 'edit' : 'create'}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
            <DocumentIcon className="h-12 w-12 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LabelInput
              label="이름"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="EQ 이름을 입력하세요"
            />
          </div>

          <div>
            <LabelInput
              label="PC"
              value={formData.pc}
              onChange={handlePCChange}
              placeholder="PC 정보를 입력하세요"
            />
          </div>

          <div>
            <AutoCompleteDropdownInput
              label="타입"
              options={[{ value: 'pdf' }, { value: 'png' }]}
              onSelect={handleTypeChange}
              placeholder="타입을 선택하세요"
              initialValue={formData.type || ''}
            />
          </div>

          <div>
            <LabelInput
              label="파일 URL"
              value={formData.file_url}
              onChange={handleFileUrlChange}
              placeholder="파일 URL을 입력하세요"
            />
          </div>
        </div>
      </div>
    </EditModal>
  );
}
