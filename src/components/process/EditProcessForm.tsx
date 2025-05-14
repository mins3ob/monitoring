'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { IProcess } from '@interfaces/index';
import Modal from '@components/Modal';
import ProcessAddForm from './ProcessAddForm';

import ImgNoImg from '@public/imgs/img_no_img.png';
import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { PencilIcon } from '@heroicons/react/24/outline';

interface SortableItemProps {
  id: string;
  index: number;
  process: IProcess;
  disabled: boolean;
  onEdit: (process: IProcess) => void;
}

function SortableItem({ id, index, process, disabled, onEdit }: SortableItemProps) {
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
        cursor: disabled ? 'not-allowed' : 'grab',
        minWidth: '200px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div {...attributes} {...listeners}>
            <span>{process.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onEdit(process)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'white',
              color: 'var(--gray-600)',
              border: '1px solid var(--gray-200)',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <PencilIcon width={16} height={16} />
          </button>
        </div>

        <div
          {...attributes}
          {...listeners}
          style={{
            width: '100%',
            height: '200px',
            marginBottom: '12px',
            position: 'relative',
          }}
        >
          <Image
            src={process.imageUrl || ImgNoImg.src}
            alt={process.name}
            fill
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </div>

        <div {...attributes} {...listeners}>
          <p>{process.description}</p>
        </div>
      </div>
    </div>
  );
}

interface IEditProcessForm {
  projectId: string;
}

export default function EditProcessForm({ projectId }: IEditProcessForm) {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<IProcess | null>(null);

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

    const project = (dummyData.projects as any[]).find(p => p.id === projectId);
    setIsEditable(project?.status === 'none');

    const projectProcesses = (dummyData.processes as IProcess[])
      .filter(process => process.project === projectId)
      .sort((a, b) => a.order - b.order);
    setProcesses(projectProcesses);
  }, [projectId]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditable) return;

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
    if (!isEditable) return;

    console.log(
      '변경된 공정 순서:',
      processes.map(process => ({
        id: process.id,
        name: process.name,
        order: process.order,
      }))
    );
  };

  const handleEditProcess = (process: IProcess) => {
    setSelectedProcess(process);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProcess(null);
  };

  useEffect(() => {
    if (isModalVisible) dispatch(showBackdrop());
    else dispatch(hideBackdrop());
  }, [isModalVisible]);

  useEffect(() => {
    if (!isVisible) setIsModalVisible(false);
  }, [isVisible]);

  return (
    <div className="column">
      <div
        style={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '10px 0',
            opacity: isEditable ? 1 : 0.7,
            cursor: isEditable ? 'default' : 'not-allowed',
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
                <SortableItem
                  key={process.id}
                  id={process.id}
                  index={index}
                  process={process}
                  disabled={!isEditable}
                  onEdit={handleEditProcess}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setIsModalVisible(true)}
            disabled={!isEditable}
            style={{
              opacity: isEditable ? 1 : 0.5,
              cursor: isEditable ? 'pointer' : 'not-allowed',
            }}
          >
            공정 추가
          </button>
          <button
            type="button"
            className="primaryBtn"
            onClick={handleSave}
            disabled={!isEditable}
            style={{
              opacity: isEditable ? 1 : 0.5,
              cursor: isEditable ? 'pointer' : 'not-allowed',
            }}
          >
            저장
          </button>
        </div>
      </div>

      {isModalVisible && (
        <Modal>
          <ProcessAddForm back={handleCloseModal} projectId={projectId} process={selectedProcess} />
        </Modal>
      )}
    </div>
  );
}
