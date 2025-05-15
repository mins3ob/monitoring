'use client';

import React from 'react';

import styles from './Table.module.css';

interface ITable {
  children: React.ReactNode;
}

export default function Table({ children }: ITable) {
  return <table className={styles.table}>{children}</table>;
}
