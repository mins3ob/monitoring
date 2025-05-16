'use client';

import React from 'react';

interface ILabelInput {
  label: string;

  type?: 'text' | 'password' | 'number' | 'date';
  value: string | number | undefined;
  placeholder?: string;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function LabelInput({
  label,

  type = 'text',
  value,
  placeholder = 'Placeholder',
  onChange,
  onKeyDown,
}: ILabelInput) {
  return (
    <div>
      <p>{label}</p>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
