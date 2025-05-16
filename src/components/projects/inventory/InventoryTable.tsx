'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import { IProcess } from '@interfaces/index';
import Table from '@components/Table';

interface ProcessInventory {
  id: string;
  date: string;
  quantity: number;
  type: string;
  processId: string;
  createdAt: string;
  updatedAt: string;
}

interface IInventoryTable {
  processes: IProcess[];
  processInventories: ProcessInventory[];
}

export default function InventoryTable({ processes, processInventories }: IInventoryTable) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  // 프로젝트에 속한 프로세스들만 필터링
  const projectProcesses = processes.filter(process => process.project === projectId);

  // 오늘 날짜의 시작과 끝
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Table>
      <thead>
        <tr>
          <th>구분</th>
          {projectProcesses.map(process => (
            <th key={process.id}>{process.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* 총 수량 행 */}
        <tr>
          <td>총 수량</td>
          {projectProcesses.map(process => {
            const processTotal = processInventories
              .filter(pi => pi.processId === process.id)
              .reduce((sum, pi) => sum + pi.quantity, 0);
            return <td key={process.id}>{processTotal}</td>;
          })}
        </tr>
        {/* 일일 생산 수량 행 */}
        <tr>
          <td>일일 생산 수량</td>
          {projectProcesses.map(process => {
            const todayProduction = processInventories
              .filter(
                pi =>
                  pi.processId === process.id &&
                  pi.type === '생산' &&
                  new Date(pi.date) >= today &&
                  new Date(pi.date) < tomorrow
              )
              .reduce((sum, pi) => sum + pi.quantity, 0);
            return <td key={process.id}>{todayProduction}</td>;
          })}
        </tr>
        {/* 폐기 수량 행 */}
        <tr>
          <td>폐기 수량</td>
          {projectProcesses.map(process => {
            const disposalTotal = processInventories
              .filter(pi => pi.processId === process.id && pi.type === '폐기')
              .reduce((sum, pi) => sum + pi.quantity, 0);
            return <td key={process.id}>{disposalTotal}</td>;
          })}
        </tr>
      </tbody>
    </Table>
  );
}
