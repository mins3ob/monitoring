'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IProjectWithStats } from '@interfaces/index';
import ProjectCard from '@components/projects/ProjectCard';
import EditProcessForm from '@components/process/EditProcessForm';
import SearchBar from '@components/SearchBar';

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
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerTarget = useRef<HTMLDivElement>(null);

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
      className="column"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <div style={{ width: '100%' }}>
        <SearchBar
          label="프로젝트"
          placeholder="프로젝트 명을 입력하세요."
          onSearch={onSearch}
          initialSearchText={searchText}
        />
      </div>

      <div>
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
    </div>
  );
}
