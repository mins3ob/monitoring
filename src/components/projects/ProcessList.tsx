'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IProjectWithStats } from '@interfaces/index';
import EditProcessForm from '@components/projects/EditProcessForm';
import SearchBar from '@components/SearchBar';
import { useSearchParams } from 'next/navigation';

interface ProcessListProps {
  projects: IProjectWithStats[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  searchText: string;
  onSearch: (text: string) => void;
}

export default function ProcessList({
  projects = [],
  onLoadMore,
  hasMore,
  searchText = '',
  onSearch = () => {},
}: ProcessListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

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

  const filteredProjects = queryId ? projects.filter(project => project.id === queryId) : projects;

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

      <div style={{ width: '100%' }}>
        {filteredProjects.map(project => (
          <div
            key={project.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <div className="box" style={{ width: '100%' }}>
              <EditProcessForm projectId={project.id} />
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
