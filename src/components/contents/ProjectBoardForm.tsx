'use client';

import React, { useState, useMemo } from 'react';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '@redux/store';

import { showBackdrop } from '@redux/slices/backdropSlice';

import projectData from '@constants/testProject.json';
import processData from '@constants/testProcess.json';
import { IProcess } from '@interfaces/index';

import { PlusIcon, CalendarIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import CSS from './Contents.module.css';

import Modal from '@components/Modal';
import ProjectAddForm from '@components/forms/ProjectAddForm';

import ImgNoImg from '@public/imgs/img_no_img.png';

interface IProjectBoardForm {
  onDetailClick: (projectId: string) => void;
}

export default function ProjectBoardForm({ onDetailClick }: IProjectBoardForm) {
  const dispatch = useDispatch<AppDispatch>();

  const [searchText, setSearchText] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const filteredProjects = useMemo(() => {
    return projectData.filter(project => {
      const nameMatch =
        searchText === '' || project.name.toLowerCase().includes(searchText.toLowerCase());
      const statusMatch =
        searchStatus === '' || project.status.toLowerCase().includes(searchStatus.toLowerCase());

      return nameMatch && statusMatch;
    });
  }, [searchText, searchStatus]);

  const clickAddBtn = (): void => {
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  return (
    <div className={CSS.column}>
      <h2>프로젝트</h2>

      <div className={CSS.row}>
        <div className={CSS.box}>
          <div className={CSS.row} style={{ padding: '10px 20px' }}>
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
          display: 'grid',
          gap: '20px',
          padding: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          width: '100%',
        }}
      >
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              width: '100%',
              minWidth: '400px',
              maxWidth: '400px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0 }}>
                <a href="#" onClick={() => onDetailClick(project.id)}>
                  {project.name} {project.status}
                </a>
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onDetailClick(project.id)}
              style={{ background: 'none', color: 'var(--font-color)', textAlign: 'left' }}
            >
              <div style={{ width: '100%', height: '200px', marginBottom: '12px' }}>
                <img
                  src={project.imgUrl || ImgNoImg.src}
                  alt={project.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <p>설명: {project.description}</p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <p>LOT: {project.lot}</p>
                <p>성공: {project.success}</p>
                <p>실패: {project.failed}</p>
              </div>

              <div>
                <p>공정:</p>
                <ul
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    flexWrap: 'wrap',
                    rowGap: '12px',
                  }}
                >
                  {project.processIds.map((processId, idx) => (
                    <React.Fragment key={idx}>
                      <li
                        style={{
                          background: 'var(--gray-50)',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
                      >
                        {
                          (processData as Record<string, IProcess[]>)[project.id].find(
                            p => p.id === processId
                          )?.name
                        }
                      </li>
                      {idx < project.processIds.length - 1 && (
                        <span style={{ color: 'var(--gray-400)' }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </button>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '12px',
                borderTop: '1px solid var(--gray-100)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
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
              >
                <EllipsisHorizontalIcon width={16} height={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalVisible && (
        <Modal content={<ProjectAddForm back={() => setIsModalVisible(false)} />} />
      )}
    </div>
  );
}
