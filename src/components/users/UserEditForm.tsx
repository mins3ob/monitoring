'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import EditModal from '@components/EditModal';
import LabelInput from '@components/inputs/LabelInput';
import AutoCompleteDropdownInput from '@components/inputs/AutoCompleteDropdownInput';

interface IUser {
  id?: number;
  email: string;
  name: string;
  role: string;
  password?: string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IUserEditForm {
  back: () => void;
  user?: IUser | null;
  onSubmit: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
}

export function UserEditForm({ back, user, onSubmit, onDelete }: IUserEditForm) {
  const [userData, setUserData] = useState<IUser>({
    email: '',
    name: '',
    role: 'operator',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image_url: user.image_url,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleRoleChange = (option: { value: string }) => {
    setUserData(prev => ({
      ...prev,
      role: option.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(userData);
  };

  const handleDelete = () => {
    if (onDelete && userData.id) {
      onDelete(userData);
    }
  };

  return (
    <EditModal
      back={back}
      title={user ? '사용자 수정/삭제' : '사용자 추가'}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mode={user ? 'edit' : 'create'}
    >
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LabelInput
              label="이름"
              value={userData.name}
              onChange={handleNameChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <LabelInput
              label="이메일"
              type="text"
              value={userData.email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
            />
          </div>

          {!user && (
            <div>
              <LabelInput
                label="비밀번호"
                type="password"
                value={userData.password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          )}

          <div>
            <AutoCompleteDropdownInput
              label="역할"
              options={[
                { value: 'admin' },
                { value: 'manager' },
                { value: 'engineer' },
                { value: 'quality' },
                { value: 'operator' },
              ]}
              onSelect={handleRoleChange}
              placeholder="역할을 선택하세요"
              initialValue={''}
            />
          </div>
        </div>
      </div>
    </EditModal>
  );
}
