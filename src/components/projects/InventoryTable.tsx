'use client';

import React from 'react';

import styles from './Inventory.module.css';

export default function InventoryTable({}: Record<string, never>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>공정</th>
        </tr>
      </thead>
    </table>
  );
}
