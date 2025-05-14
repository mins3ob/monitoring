'use client';

import React, { useState, useMemo, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';

import dummyData from '@constants/erd_dummy_data.json';

import { PlusIcon, CalendarIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import { IProject, IProcess, ILot, IProjectWithStats } from '@interfaces/index';

import Modal from '@components/Modal';
import ProjectAddForm from '@components/forms/ProjectAddForm';
import ProjectCard from '@components/projects/ProjectCard';

import ImgNoImg from '@public/imgs/img_no_img.png';

export default function BoardForm() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  const [searchText, setSearchText] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [isExpandedProject, setIsExpandedProject] = useState<boolean>(false);

  const projectsWithStats = useMemo(() => {
    return (dummyData.projects as IProject[]).map(project => {
      const projectLots = (dummyData.lots as ILot[]).filter(lot => lot.project === project.id);
      const successCount = projectLots.filter(lot => lot.result === 'pass').length;
      const failCount = projectLots.filter(lot => lot.result === 'fail').length;
      const projectProcesses = (dummyData.processes as IProcess[]).filter(
        process => process.project === project.id
      );

      return {
        ...project,
        lotCount: projectLots.length,
        successCount,
        failCount,
        processes: projectProcesses,
      };
    }) as IProjectWithStats[];
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsWithStats.filter(project => {
      const nameMatch =
        searchText === '' || project.name.toLowerCase().includes(searchText.toLowerCase());
      const statusMatch =
        searchStatus === '' || project.status.toLowerCase().includes(searchStatus.toLowerCase());

      return nameMatch && statusMatch;
    });
  }, [projectsWithStats, searchText, searchStatus]);

  const clickAddBtn = (): void => {
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!isVisible) {
      setIsModalVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isModalVisible) dispatch(hideBackdrop());
  }, [isModalVisible, dispatch]);

  return (
    <div className="column">
      <h2>프로젝트</h2>

      <div className="row">
        <div className="box">
          <div className="row" style={{ padding: '10px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ flex: 1 }}>프로젝트</p>

              <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="프로젝트 명을 입력하세요."
                style={{ flex: 3 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ flex: 1 }}>진행상태</p>

              <input
                type="text"
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
                placeholder="진행상태를 입력하세요."
                style={{ flex: 3 }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <button
                type="button"
                style={{
                  background: 'white',
                  border: '1px solid var(--primary-color)',
                  color: 'var(--primary-color)',
                }}
              >
                조회
              </button>
              <button
                type="button"
                onClick={clickAddBtn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: isExpandedProject ? 'flex' : 'grid',
          gap: '20px',
          padding: '20px',
          ...(isExpandedProject
            ? { flexDirection: 'column', alignItems: 'flex-start' }
            : { gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }),
          width: '100%',
        }}
      >
        {filteredProjects.map(project => (
          <div
            key={project.id}
            style={{
              display: 'flex',
              gap: '20px',
              width: '100%',
            }}
          >
            <div style={{ flex: '1' }}>
              <ProjectCard
                project={project}
                actionButtons={
                  <>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
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
                        <PlusIcon width={16} height={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`?view=calendar&id=${project.id}`)}
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
                        <CalendarIcon width={16} height={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setExpandedProjectId(expandedProjectId === project.id ? null : project.id);
                        setIsExpandedProject(!isExpandedProject);
                      }}
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
                      <EllipsisHorizontalIcon width={16} height={16} />
                    </button>
                  </>
                }
              />
            </div>

            {isExpandedProject && (
              <div className="box">
                <h3>Process 관리</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalVisible && (
        <Modal>
          <ProjectAddForm back={() => setIsModalVisible(false)} />
        </Modal>
      )}
    </div>
  );
}
