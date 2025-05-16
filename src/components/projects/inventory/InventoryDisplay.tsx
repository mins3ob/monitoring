'use client';

import React from 'react';

// import dummyData from '@data/new_dummy_inventory_data.json'; // 경로 확인 필요
import inventoriesData from '@data/inventories.json';
import partInventoriesData from '@data/part_inventories.json';
import processesData from '@data/processes.json'; // processes.json 가져오기
import processInventoriesData from '@data/process_inventories.json';
import { IInventory, IProcess } from '@interfaces/index';
import styles from './Inventory.module.css'; // 경로 수정 (@components -> ..)

import PartInventoryTable from '@components/projects/inventory/PartInventoryTable';
import InventoryTable from '@components/projects/inventory/InventoryTable';

interface IInventoryItem {
  id: string;
  name: string;
  code: string;
  supplier: string;
  quantity: number;
  date: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  remainingQuantity: number; // inventories.json에 있는 필드
  // projectId?: string; // 프로젝트 ID가 있다면 추가
}

interface IPartInventoryEntry {
  id: string;
  processId: string;
  inventoryId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  // projectId?: string; // 만약 part_inventories.json에 projectId 필드가 있다면 추가
}

interface InventoryDisplayProps {
  projectId: string; // DetailForm으로부터 projectId를 받음
}

const convertToIInventory = (
  inventories: IInventoryItem[],
  partInventories: IPartInventoryEntry[],
  processes: IProcess[], // processes 데이터 추가
  targetProjectId: string
): IInventory[] => {
  const allInventoryItems: IInventory[] = [];

  // 1. targetProjectId와 일치하는 process들을 찾음
  const targetProcesses = processes.filter(proc => proc.project === targetProjectId);

  // 2. 찾은 process들의 id 목록을 만듦
  const targetProcessIds = targetProcesses.map(proc => proc.id);

  partInventories.forEach(partEntry => {
    // 3. partEntry.processId가 targetProcessIds에 포함되는지 확인
    if (targetProcessIds.includes(partEntry.processId)) {
      const inventoryItem = inventories.find(inv => inv.id === partEntry.inventoryId);
      if (inventoryItem) {
        // 4. 해당 process 정보 찾기 (옵션: process 이름을 표시하고 싶을 경우)
        const processInfo = targetProcesses.find(proc => proc.id === partEntry.processId);

        allInventoryItems.push({
          partNo: inventoryItem.code,
          partName: inventoryItem.name,
          quantity: partEntry.quantity,
          process: processInfo ? processInfo.name : partEntry.processId, // process 이름 또는 ID
          company: inventoryItem.supplier,
          incomingQuantity: inventoryItem.type === 'incoming' ? inventoryItem.quantity : 0,
          lastIncomingDate: inventoryItem.date,
          remainingQuantity: inventoryItem.remainingQuantity,
          remarks: inventoryItem.description,
        });
      }
    }
  });

  return allInventoryItems;
};

export default function InventoryDisplay({ projectId }: InventoryDisplayProps) {
  // projectId를 사용하여 데이터를 필터링하거나 가져오는 로직 추가 필요
  // inventoriesData와 partInventoriesData를 IInventoryItem[] 및 IPartInventoryEntry[]로 타입 단언
  const typedInventoriesData = inventoriesData as IInventoryItem[];
  const typedPartInventoriesData = partInventoriesData as IPartInventoryEntry[];
  const typedProcessesData = processesData as IProcess[];

  const inventoryData = convertToIInventory(
    typedInventoriesData,
    typedPartInventoriesData,
    typedProcessesData,
    projectId
  );

  // DetailForm 내에 표시되므로, h2 제목이나 SearchBar는 필요 없을 수 있습니다.
  // 필요에 따라 제거하거나 수정합니다.
  return (
    <div>
      <div className={`box ${styles.box}`} style={{ padding: 20, marginTop: 16 }}>
        {/* marginTop 추가 */}
        <h3>부품 재고 현황</h3>
        <PartInventoryTable data={inventoryData} />
      </div>
      <div className={`box ${styles.box}`} style={{ padding: 20, marginTop: 16 }}>
        {/* marginTop 추가 */}
        <h3>공정 재고 현황</h3>
        <InventoryTable
          processes={typedProcessesData}
          processInventories={processInventoriesData}
        />
      </div>
    </div>
  );
}
