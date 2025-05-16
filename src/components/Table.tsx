'use client';

import React from 'react';

import styles from './Table.module.css';

interface ITable {
  children: React.ReactNode;
  className?: string;
}

export default function Table({ children, className }: ITable) {
  return <table className={`${styles.table} ${className || ''}`}>{children}</table>;
}
