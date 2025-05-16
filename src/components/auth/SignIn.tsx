'use client';

import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@redux/store';

import { signIn } from '@redux/slices/authSlice';

import { validateEmail, validatePassword } from '@utils/index';

import LabelInput from '@components/inputs/LabelInput';
import CheckBoxBtn from '@components/btns/CheckBoxBtn';

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string>('');
  const [pw, setPw] = useState<string>('');

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const clickBtn = (): void => {
    if (validateEmail(email) && validatePassword(pw)) dispatch(signIn({ email, pw }));
    else alert('이메일 또는 비밀번호 형식이 올바르지 않습니다.');
  };

  return (
    <div className="w-[500px] bg-white shadow-sm" style={{ padding: '40px 50px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h4>Welcome Back</h4>

        <p>Please log in to continue</p>
      </div>

      <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <LabelInput
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <LabelInput
            label="Password"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') clickBtn();
            }}
          />
        </div>

        <p style={{ marginBottom: 20, color: 'var(--gray-400)' }}>
          It must be a combination of minimum 8 letters, numbers, and symbols.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', columnGap: 10, marginBottom: 20 }}>
          <CheckBoxBtn size={10} isChecked={isChecked} onClick={() => setIsChecked(!isChecked)} />

          <span>Remember me</span>
        </div>

        <button type="button" onClick={clickBtn} style={{ width: '100%' }}>
          Log in
        </button>
      </div>
    </div>
  );
}
