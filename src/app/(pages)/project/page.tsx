'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import BoardForm from '@components/projects/BoardForm';
import DetailForm from '@components/projects/DetailForm';

type ViewMode = 'detail' | 'board' | 'edit-process';

function ProjectContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    const view = searchParams.get('view') as ViewMode;
    const id = searchParams.get('id');

    if (view) setViewMode(view);
    else setViewMode('board');

    if (id) setSelectedProjectId(id);
  }, [searchParams]);

  const renderContent = () => {
    switch (viewMode) {
      case 'detail':
        return <DetailForm projectId={selectedProjectId} />;
      default:
        return <BoardForm />;
    }
  };

  return <div>{renderContent()}</div>;
}

export default function Project() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProjectContent />
    </Suspense>
  );
}
