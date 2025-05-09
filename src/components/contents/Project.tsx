'use client';

import React, { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import ProjectBoardForm from './ProjectBoardForm';
import ProjectDetailForm from './ProjectDetailForm';

export default function Project() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const handleDetailClick = (projectId: string): void => {
    router.push(`?view=detail&id=${projectId}`);
    setSelectedProjectId(projectId);
    setShowDetail(true);
  };

  const handleBackClick = (): void => {
    router.back(); // 브라우저의 뒤로가기
    setShowDetail(false);
    setSelectedProjectId('');
  };

  // URL 파라미터나 쿼리스트링에 따라 상세 페이지 표시 여부 결정
  useEffect(() => {
    const view = searchParams.get('view');
    const id = searchParams.get('id');
    setShowDetail(view === 'detail');
    if (id) setSelectedProjectId(id);
  }, [searchParams]);

  return showDetail ? (
    <ProjectDetailForm onBack={handleBackClick} projectId={selectedProjectId} />
  ) : (
    <ProjectBoardForm onDetailClick={handleDetailClick} />
  );
}
