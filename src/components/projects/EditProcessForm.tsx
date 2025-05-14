'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dummyData from '@data/erd_dummy_data.json';
import { IProcess, IProjectWithStats } from '@interfaces/index';

interface SortableItemProps {
  id: string;
  index: number;
  name: string;
}

function SortableItem({ id, index, name }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '16px',
        marginRight: '8px',
        background: 'var(--gray-50)',
        borderRadius: '4px',
        cursor: 'grab',
        minWidth: '150px',
        ...style,
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--gray-500)' }}>{index + 1}.</span>
        <span>{name}</span>
      </div>
    </div>
  );
}

interface IEditProcessForm {
  projectId: string;
}

export default function EditProcessForm({ projectId }: IEditProcessForm) {
  const router = useRouter();
  const [processes, setProcesses] = useState<IProcess[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const projectProcesses = (dummyData.processes as IProcess[])
      .filter(process => process.project === projectId)
      .sort((a, b) => a.order - b.order);
    setProcesses(projectProcesses);
  }, [projectId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProcesses(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        return newItems;
      });
    }
  };

  const handleSave = () => {
    // TODO: API 호출하여 변경된 순서 저장
    router.push('/project');
  };

  return (
    <div className="column">
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '10px 0',
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={processes.map(p => p.id)}
              strategy={horizontalListSortingStrategy}
            >
              {processes.map((process, index) => (
                <SortableItem key={process.id} id={process.id} index={index} name={process.name} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" className="primaryBtn" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
