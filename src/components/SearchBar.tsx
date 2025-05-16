'use client';

import React, { useState, useEffect } from 'react';

import styles from './SearchBar.module.css';

interface ISearchBar {
  onSearch: (text: string, extraValue?: string) => void;
  onClickAdd?: () => void;
  label: string;
  placeholder?: string;
  isAddButtonVisible?: boolean;
  extraInput?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label: string;
  };
  initialSearchText?: string;
}

export default function SearchBar({
  onSearch,
  onClickAdd,
  isAddButtonVisible = false,
  label,
  placeholder = '입력해주세요.',
  extraInput,
  initialSearchText = '',
}: ISearchBar) {
  const [tempSearchText, setTempSearchText] = useState<string>(initialSearchText);
  const [tempExtraValue, setTempExtraValue] = useState<string>(extraInput?.value || '');

  useEffect(() => {
    setTempSearchText(initialSearchText);
  }, [initialSearchText]);

  useEffect(() => {
    if (extraInput) {
      setTempExtraValue(extraInput.value);
    }
  }, [extraInput]);

  const clickSearch = (): void => {
    onSearch(tempSearchText, tempExtraValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      clickSearch();
    }
  };

  return (
    <div
      className="box"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 50 }} className={styles.searchBox}>
        <div>
          <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
          <input
            type="text"
            value={tempSearchText}
            onChange={e => setTempSearchText(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyPress}
            style={{ width: 200, borderRadius: 4, border: '1px solid var(--gray-200)' }}
          />
        </div>

        {extraInput && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ whiteSpace: 'nowrap' }}>{extraInput.label}</span>
              <input
                type="text"
                value={tempExtraValue}
                onChange={e => {
                  setTempExtraValue(e.target.value);
                  extraInput.onChange(e.target.value);
                }}
                placeholder={extraInput.placeholder}
                onKeyDown={handleKeyPress}
                style={{ width: 200, borderRadius: 4, border: '1px solid var(--gray-200)' }}
              />
            </div>
          </div>
        )}
      </div>

      <div
        style={{ display: 'flex', alignItems: 'center', gap: 20 }}
        className={styles.searchBtnBox}
      >
        <button type="button" onClick={clickSearch}>
          조회
        </button>

        {isAddButtonVisible && (
          <button type="button" onClick={onClickAdd}>
            추가
          </button>
        )}
      </div>
    </div>
  );
}
