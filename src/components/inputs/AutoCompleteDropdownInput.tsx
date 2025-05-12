'use client';

import React, { useEffect, useState } from 'react';

import Styles from './inputs.module.css';

type Option = {
  value: string;
};

interface IAutoCompleteDropdownInput {
  options: Option[];
  onSelect: (option: Option) => void;
  placeholder?: string;
  label: string;
}

export default function AutoCompleteDropdownInput({
  options,
  onSelect,
  placeholder = 'Search...',
  label,
}: IAutoCompleteDropdownInput) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (inputValue === '') {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter(option => option.value.toLowerCase().includes(inputValue.toLowerCase()))
      );
    }
  }, [inputValue, options]);

  const handleSelect = (option: Option) => {
    setInputValue(option.value);
    setShowDropdown(false);
    onSelect(option);
    setSelectedIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const selectedOption = filteredOptions.find(option => option.value === inputValue);
      if (!selectedOption && inputValue !== '') {
        setInputValue('');
        onSelect({ value: '' });
      }
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div>
      <p>{label}</p>

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        {showDropdown && filteredOptions.length > 0 && (
          <ul
            className={Styles.autoCompleteDropdownInput}
            style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              border: '1px solid #ccc',
              borderTop: 'none',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: '#fff',
            }}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  backgroundColor: index === selectedIndex ? 'var(--gray-100)' : 'transparent',
                }}
              >
                {option.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
