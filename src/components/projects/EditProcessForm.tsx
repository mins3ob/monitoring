'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@redux/store';
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
import dummyData from '@constants/erd_dummy_data.json';
import { IProcess, IProjectWithStats } from '@interfaces/index';
import ProjectCard from '@components/projects/ProjectCard';

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

export default function EditProcessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [project, setProject] = useState<IProjectWithStats | null>(null);

  const projectId = searchParams.get('id');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!projectId) {
      router.push('/project');
      return;
    }

    const projectProcesses = (dummyData.processes as IProcess[])
      .filter(process => process.project === projectId)
      .sort((a, b) => a.order - b.order);
    setProcesses(projectProcesses);

    // 프로젝트 정보 가져오기
    const projectData = (dummyData.projects as IProjectWithStats[]).find(p => p.id === projectId);
    if (projectData) {
      // 프로젝트에 processes 정보 추가
      const projectWithProcesses: IProjectWithStats = {
        ...projectData,
        processes: projectProcesses,
        lotCount: 0, // TODO: 실제 데이터로 대체
        successCount: 0, // TODO: 실제 데이터로 대체
        failCount: 0, // TODO: 실제 데이터로 대체
      };
      setProject(projectWithProcesses);
    }
  }, [projectId, router]);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>공정 순서 수정</h2>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>{project && <ProjectCard project={project} />}</div>

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
      </div>
    </div>
  );
}
