'use client';

import React, { useMemo, useState, useCallback } from 'react';
import ProcessList from '@components/process/ProcessList';
import dummyData from '@data/erd_dummy_data.json';
import { IProject, IProcess, ILot, IProjectWithStats } from '@interfaces/index';

const ITEMS_PER_PAGE = 5;

export default function ProcessPage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  const allProjectsWithStats = useMemo(() => {
    return (dummyData.projects as IProject[])
      .filter(
        project =>
          searchText === '' || project.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .map(project => {
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
  }, [searchText]);

  const projectsWithStats = useMemo(() => {
    return allProjectsWithStats.slice(0, page * ITEMS_PER_PAGE);
  }, [allProjectsWithStats, page]);

  const handleLoadMore = useCallback(async () => {
    if (projectsWithStats.length >= allProjectsWithStats.length) {
      setHasMore(false);
      return;
    }

    setPage(prev => prev + 1);
  }, [projectsWithStats.length, allProjectsWithStats.length]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    setPage(1);
    setHasMore(true);
  }, []);

  return (
    <div className="column">
      <h2>프로세스</h2>

      <ProcessList
        projects={projectsWithStats}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        searchText={searchText}
        onSearch={handleSearch}
      />
    </div>
  );
}
