'use client';

import React, { useState, useEffect } from 'react';
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
import projectsData from '@data/projects.json';
import processesData from '@data/processes.json';
import { IProcess, IProject } from '@interfaces/index';
import Modal from '@components/Modal';
import ProcessAddForm from './ProcessAddForm';

import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { PencilIcon, PlusIcon, DocumentCheckIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface SortableItemProps {
  id: string;
  process: IProcess;
  disabled: boolean;
  onEdit: (process: IProcess) => void;
}

function SortableItem({ id, process, disabled, onEdit }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 400,
        padding: '20px',
        marginRight: '16px',
        background: 'white',
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'grab',
        minWidth: '200px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--gray-100)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div {...attributes} {...listeners}>
            <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-800)' }}>
              {process.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEdit(process)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PencilIcon width={16} height={16} />
            <span style={{ fontSize: '14px' }}>수정</span>
          </button>
        </div>

        <div
          {...attributes}
          {...listeners}
          style={{
            width: '100%',
            height: '220px',
            marginBottom: '16px',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gray-50)',
          }}
        >
          {process.imageUrl ? (
            <Image
              src={process.imageUrl}
              alt={process.name}
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ) : (
            <PhotoIcon width={48} height={48} style={{ color: 'var(--gray-400)' }} />
          )}
        </div>

        <div {...attributes} {...listeners}>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--gray-600)',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            {process.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface IEditProcessForm {
  projectId: string;
}

export default function EditProcessForm({ projectId }: IEditProcessForm) {
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

    const project = projectsData.find((p: IProject) => p.id === projectId);
    setIsEditable(project?.status === 'none');

    const projectProcesses = (
      processesData.map(process => ({ ...process, barcode: '' })) as IProcess[]
    )
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
  }, [isModalVisible, dispatch]);

  useEffect(() => {
    if (!isVisible) setIsModalVisible(false);
  }, [isVisible]);

  return (
    <div className="column">
      <div
        style={{
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          height: '100%',
          background: 'var(--gray-50)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '16px 0',
            opacity: isEditable ? 1 : 0.7,
            cursor: isEditable ? 'default' : 'not-allowed',
            scrollbarWidth: 'thin',
            msOverflowStyle: 'none',
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
              <div style={{ display: 'flex', padding: '8px' }}>
                {processes.map(process => (
                  <SortableItem
                    key={process.id}
                    id={process.id}
                    process={process}
                    disabled={!isEditable}
                    onEdit={handleEditProcess}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '16px',
            padding: '16px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <button
            type="button"
            onClick={() => setIsModalVisible(true)}
            disabled={!isEditable}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <PlusIcon className="w-5 h-5" />
            공정 추가
          </button>
          <button
            type="button"
            className="reverseBtn"
            onClick={handleSave}
            disabled={!isEditable}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <DocumentCheckIcon className="w-5 h-5" />
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
