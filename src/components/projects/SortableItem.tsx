'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IProcess } from '@interfaces/index';

interface SortableItemProps {
  id: string;
  index: number;
  process: IProcess;
  disabled?: boolean;
}

export default function SortableItem({ id, index, process, disabled }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '12px',
        margin: '0 8px',
        background: 'var(--gray-50)',
        borderRadius: '4px',
        minWidth: '200px',
        ...style,
      }}
      {...attributes}
      {...(!disabled ? listeners : {})}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            background: 'var(--gray-200)',
            color: 'var(--gray-600)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {index + 1}
        </span>
        <span>{process.name}</span>
      </div>
    </div>
  );
}
