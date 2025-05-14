'use client';

import React from 'react';

import dummyData from '@data/dummy_inventory_data.json';

import InventoryTable from '@components/inventory/InventoryTable';
import { IInventory } from '@interfaces/index';
import SearchBar from '@components/SearchBar';

interface IDummyInventory {
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
  partInventoryList: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

const convertToIInventory = (dummyData: IDummyInventory[]): IInventory[] => {
  return dummyData.map(item => ({
    partNo: item.code,
    partName: item.name,
    quantity: item.quantity,
    process: '-',
    company: item.supplier,
    incomingQuantity: item.type === 'incoming' ? item.quantity : 0,
    lastIncomingDate: item.date,
    remainingQuantity: item.quantity,
    remarks: item.description,
  }));
};

export default function InventoryPage() {
  const inventoryData = convertToIInventory(dummyData as IDummyInventory[]);

  return (
    <div className="column">
      <h2>재고</h2>

      <SearchBar
        label="프로젝트"
        placeholder="프로젝트 명을 입력하세요."
        onSearch={() => {}}
        onClickAdd={() => {}}
      />

      <div className="box">
        <InventoryTable data={inventoryData} />
      </div>
    </div>
  );
}
