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
          <th>부품 번호</th>
          <th>부품명</th>
          <th>공정</th>
          <th>수량</th>
          <th>입고 수량</th>
          <th>최근 입고일</th>
          <th>잔여 수량</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.partNo}</td>
            <td>{item.partName}</td>
            <td>{item.process}</td>
            <td>{item.quantity}</td>
            <td>{item.incomingQuantity}</td>
            <td>{item.lastIncomingDate}</td>
            <td>{item.remainingQuantity}</td>
            <td>{item.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
