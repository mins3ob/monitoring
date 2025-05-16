'use client';

import React, { useMemo, useState, useCallback } from 'react';
import ProcessList from '@components/projects/process/ProcessList';
import projectsFromFile from '@data/projects.json';
import { IProject, IProcess, ILot, IProjectWithStats } from '@interfaces/index';

const ITEMS_PER_PAGE = 5;

export default function ProcessPage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  const allProjectsWithStats = useMemo(() => {
    const typedProjects = projectsFromFile as IProject[];

    return typedProjects
      .filter(
        project =>
          searchText === '' || project.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .map(project => {
        const projectLots: ILot[] = [];
        const successCount = 0;
        const failCount = 0;
        const projectProcesses: IProcess[] = [];

        return {
          ...project,
          lotCount: projectLots.length,
          successCount,
          failCount,
          processes: projectProcesses,
        } as IProjectWithStats;
      });
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
