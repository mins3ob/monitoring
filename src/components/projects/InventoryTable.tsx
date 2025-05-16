'use client';

import React from 'react';

import styles from './Inventory.module.css';

interface IInventoryTable {}

export default function InventoryTable({}: IInventoryTable) {
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
