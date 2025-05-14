'use client';

import React from 'react';

import { IInventory } from '@interfaces/index';

interface IInventoryTable {
  data: IInventory[];
}

export default function InventoryTable({ data }: IInventoryTable) {
  return (
    <table style={{ width: '100%' }}>
      <colgroup>
        <col width="5%" />
        <col width="10%" />
        <col width="15%" />
        <col width="8%" />
        <col width="12%" />
        <col width="12%" />
        <col width="10%" />
        <col width="12%" />
        <col width="8%" />
        <col width="8%" />
      </colgroup>

      <thead>
        <tr>
          <th>NO.</th>
          <th>P/NO</th>
          <th>P/NAME</th>
          <th>Q&apos;TY</th>
          <th>공정</th>
          <th>업체명</th>
          <th>입고 수량</th>
          <th>최종 입고일</th>
          <th>잔여 수량</th>
          <th>비고</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.partNo}</td>
            <td>{item.partName}</td>
            <td>{item.quantity}</td>
            <td>{item.process}</td>
            <td>{item.company}</td>
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
