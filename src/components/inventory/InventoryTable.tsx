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
          <th>Q'TY</th>
          <th>공정</th>
          <th>업체명</th>
          <th>입고 수량</th>
          <th>최종 입고일</th>
          <th>잔여 수량</th>
          <th>비고</th>
        </tr>
      </thead>

      <tbody></tbody>
    </table>
  );
}
