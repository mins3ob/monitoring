'use client';

import React from 'react';

import { IInventory } from '@interfaces/index';

import Table from '@components/Table';

interface IPartInventoryTable {
  data: IInventory[];
}

export default function PartInventoryTable({ data }: IPartInventoryTable) {
  const sortedData = [...data].sort((a, b) => {
    if (a.process < b.process) return -1;
    if (a.process > b.process) return 1;
    return 0;
  });

  return (
    <Table>
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
        {sortedData.map((item, index) => {
          let rowSpan = 1;
          let showProcessCell = true;

          if (index > 0 && item.process === sortedData[index - 1].process) {
            showProcessCell = false;
          } else {
            for (let i = index + 1; i < sortedData.length; i++) {
              if (sortedData[i].process === item.process) {
                rowSpan++;
              } else {
                break;
              }
            }
          }

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.partNo}</td>
              <td>{item.partName}</td>
              <td>{item.quantity}</td>
              {showProcessCell && <td rowSpan={rowSpan}>{item.process}</td>}
              <td>{item.company}</td>
              <td>{item.incomingQuantity}</td>
              <td>{item.lastIncomingDate}</td>
              <td>{item.remainingQuantity}</td>
              <td>{item.remarks}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
