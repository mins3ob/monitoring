'use client';

import React from 'react';

import { IInventory } from '@interfaces/index';

import styles from './Inventory.module.css';

interface IInventoryTable {
  data: IInventory[];
}

export default function InventoryTable({ data }: IInventoryTable) {
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
