'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';

import projectsData from '../../data/projects.json';

import { PlusIcon, CalendarIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import { IProject, IProjectWithStats } from '@interfaces/index';

import Modal from '@components/Modal';
import ProjectEditForm from '@components/projects/ProjectEditForm';
import ProjectCard from '@components/projects/ProjectCard';
import SearchBar from '@components/SearchBar';

export default function BoardForm() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  const searchText = '';
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [appliedSearchText, setAppliedSearchText] = useState<string>('');
  const [appliedSearchStatus, setAppliedSearchStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<IProjectWithStats | null>(null);
  const [visibleProjects, setVisibleProjects] = useState<number>(6);
  const observer = useRef<IntersectionObserver | null>(null);
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const projectsWithStats = useMemo(() => {
    return projectsData.map(project => ({
      ...project,
      lotCount: 0,
      successCount: 0,
      failCount: 0,
      processes: [],
    })) as IProjectWithStats[];
  }, []);

  const handleSearch = (newSearchText: string, newSearchStatus?: string) => {
    setAppliedSearchText(newSearchText);
    setAppliedSearchStatus(newSearchStatus || '');
  };

  const filteredProjects = useMemo(() => {
    return projectsWithStats.filter(project => {
      const nameMatch =
        appliedSearchText === '' ||
        project.name.toLowerCase().includes(appliedSearchText.toLowerCase());
      const statusMatch =
        appliedSearchStatus === '' ||
        project.status.toLowerCase().includes(appliedSearchStatus.toLowerCase());

      return nameMatch && statusMatch;
    });
  }, [projectsWithStats, appliedSearchText, appliedSearchStatus]);

  const lastProjectRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && visibleProjects < filteredProjects.length) {
          setVisibleProjects(prev => prev + 6);
        }
      });
      if (node) observer.current.observe(node);
    },
    [filteredProjects.length, visibleProjects]
  );

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleProjects);
  }, [filteredProjects, visibleProjects]);

  const clickAddBtn = (): void => {
    setSelectedProject(null);
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleEditProject = (project: IProjectWithStats): void => {
    setSelectedProject(project);
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
        <SearchBar
          label="프로젝트"
          placeholder="프로젝트 명을 입력하세요."
          onSearch={handleSearch}
          onClickAdd={clickAddBtn}
          isAddButtonVisible={true}
          extraInput={{
            value: searchStatus,
            onChange: setSearchStatus,
            placeholder: '진행상태를 입력하세요.',
            label: '진행상태',
          }}
          initialSearchText={searchText}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          width: '100%',
        }}
      >
        {displayedProjects.map((project, index) => (
          <div
            key={project.id}
            ref={el => {
              projectRefs.current[project.id] = el;
              if (index === displayedProjects.length - 1) {
                lastProjectRef(el);
              }
            }}
            style={{
              display: 'flex',
              gap: '20px',
              width: '100%',
            }}
          >
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
                    onClick={() => handleEditProject(project)}
                  >
                    <EllipsisHorizontalIcon width={16} height={16} />
                  </button>
                </>
              }
            />
          </div>
        ))}
      </div>

      {isModalVisible && (
        <Modal>
          <ProjectEditForm back={() => setIsModalVisible(false)} project={selectedProject} />
        </Modal>
      )}
    </div>
  );
}
