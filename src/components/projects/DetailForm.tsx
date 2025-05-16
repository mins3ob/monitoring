'use client';

import React, { useEffect, useState, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';

import projectsData from '../../data/projects.json';
import processesData from '../../data/processes.json';
import lotsData from '../../data/lots.json';
import lotProcessesData from '../../data/lotProcesses.json';

import { IProject, ILot, ILotProcess } from '@interfaces/index';

import Modal from '@components/Modal';

import LotAddForm from '@components/projects/LotAddForm';
import CalendarForm from '@components/projects/CalendarForm';
import InventoryDisplay from './InventoryDisplay';
import ProcessPage from './ProcessPage';
import OverviewTab from './OverviewTab';
import LotHistoryTab from './LotHistoryTab';

interface IDetailForm {
  projectId: string;
}

const TABS = [
  { id: 'overview', label: '개요' },
  { id: 'process', label: '공정' },
  { id: 'inventory', label: '재고' },
  { id: 'calendar', label: '캘린더' },
  { id: 'history', label: '이력' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function DetailForm({ projectId }: IDetailForm) {
  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tab, setTab] = useState<TabId>('overview');
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  const project: IProject | undefined = useMemo(() => {
    return projectsData.find(p => p.id === projectId) as IProject | undefined;
  }, [projectId]);

  const projectProcesses = useMemo(() => {
    return processesData

      .filter(process => process.project === projectId)
      .sort((a, b) => a.order - b.order);
  }, [projectId]);

  const projectLots = useMemo(() => {
    return (lotsData as unknown as ILot[])
      .map(lot => ({
        ...lot,
        createdAt: lot.startDate || new Date().toISOString(),
        updatedAt: lot.endDate || new Date().toISOString(),
      }))
      .filter(lot => lot.project === projectId);
  }, [projectId]);

  const lotProcesses = useMemo(() => {
    return (lotProcessesData as ILotProcess[]).filter(lp =>
      projectLots.some(lot => lot.id === lp.lot)
    );
  }, [projectLots]);

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '8px 24px',
    borderRadius: 6,
    border: 'none',
    background: isActive ? '#222b3a' : '#f3f4f6',
    color: isActive ? '#fff' : '#222b3a',
    fontWeight: isActive ? 700 : 500,
    cursor: 'pointer',
    fontSize: 16,
  });

  const handleTabClick = (newTab: TabId) => {
    setTab(newTab);
    if (newTab === 'history') {
      setSelectedLotId(null);
    }
  };

  const clickAddLot = (): void => {
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleLotClick = (lotId: string): void => {
    setSelectedLotId(lotId);
    setTab('history');
  };

  useEffect(() => {
    if (!isVisible) setIsModalVisible(false);
  }, [isVisible]);

  useEffect(() => {
    if (!isModalVisible) dispatch(hideBackdrop());
  }, [isModalVisible, dispatch]);

  if (!project) {
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
          <h2>프로젝트 상세</h2>
        </div>

        <div className="box" style={{ padding: '20px' }}>
          <p>프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
        <h2>프로젝트 상세</h2>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {TABS.map(tabItem => (
          <button
            key={tabItem.id}
            type="button"
            onClick={() => handleTabClick(tabItem.id)}
            style={tabButtonStyle(tab === tabItem.id)}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div>
        {(() => {
          const TAB_CONTENTS: Record<TabId, React.ReactNode> = {
            overview: (
              <OverviewTab
                project={project}
                projectProcesses={projectProcesses}
                lotProcesses={lotProcesses}
                projectLots={projectLots}
                handleLotClick={handleLotClick}
              />
            ),
            process: <ProcessPage />,
            inventory: <InventoryDisplay projectId={projectId} />,
            calendar: <CalendarForm />,
            history: (
              <LotHistoryTab
                projectLots={projectLots}
                lotProcesses={lotProcesses}
                handleLotClick={handleLotClick}
                clickAddLot={clickAddLot}
                selectedLotId={selectedLotId}
                setSelectedLotId={setSelectedLotId}
                projectId={projectId}
              />
            ),
          };
          return TAB_CONTENTS[tab];
        })()}
      </div>

      {isModalVisible && (
        <Modal>
          <LotAddForm back={() => setIsModalVisible(false)} />
        </Modal>
      )}
    </div>
  );
}
