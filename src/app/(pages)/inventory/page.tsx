'use client';

import React from 'react';

import dummyData from '@data/dummy_inventory_data.json';

import InventoryTable from '@components/inventory/InventoryTable';
import { IInventory } from '@interfaces/index';
import SearchBar from '@components/SearchBar';

export default function InventoryPage() {
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
        <InventoryTable data={dummyData as IInventory[]} />
      </div>
    </div>
  );
}
