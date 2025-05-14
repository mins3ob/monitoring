'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IProjectWithStats } from '@interfaces/index';
import ProjectCard from '@components/projects/ProjectCard';
import EditProcessForm from '@components/process/EditProcessForm';

interface ProcessListProps {
  projects: IProjectWithStats[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  searchText: string;
  onSearch: (text: string) => void;
}

export default function ProcessList({
  projects,
  onLoadMore,
  hasMore,
  searchText = '',
  onSearch = () => {},
}: ProcessListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tempSearchText, setTempSearchText] = useState<string>(searchText);
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    onSearch(tempSearchText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setTempSearchText(searchText);
  }, [searchText]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          await onLoadMore();
          setIsLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <div className="box" style={{ width: '100%' }}>
        <div className="row" style={{ padding: '10px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ flex: 1 }}>프로젝트</p>
            <input
              type="text"
              value={tempSearchText}
              onChange={e => setTempSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="프로젝트 명을 입력하세요."
              style={{
                flex: 3,
                padding: '8px 12px',
                border: '1px solid var(--gray-200)',
                borderRadius: '4px',
                fontSize: '14px',
              }}
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
              onClick={handleSearch}
              style={{
                background: 'white',
                border: '1px solid var(--primary-color)',
                color: 'var(--primary-color)',
              }}
            >
              조회
            </button>
          </div>
        </div>
      </div>

      {projects.map(project => (
        <div
          key={project.id}
          ref={el => {
            projectRefs.current[project.id] = el;
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr',
            gap: '20px',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <ProjectCard project={project} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="box">
              <EditProcessForm projectId={project.id} />
            </div>
          </div>
        </div>
      ))}

      <div ref={observerTarget} style={{ width: '100%', height: '20px' }}>
        {isLoading && <div>로딩 중...</div>}
      </div>
    </div>
  );
}
