'use client';

import React from 'react';
import Image from 'next/image';
// import dynamic from 'next/dynamic'; // ReactApexChart 삭제로 인해 주석 처리

import { IProject, ILot, IProcess, ILotProcess } from '@interfaces/index';
import Table from '@components/Table';
import ImgNoImg from '@public/imgs/img_no_img.png';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }); // 삭제

interface ProjectStats {
  totalLots: number;
  completedLots: number;
  inProgressLots: number;
  // processStatusData 삭제
}

function useProjectOverviewStats(
  projectProcesses: IProcess[],
  lotProcesses: ILotProcess[],
  projectLots: ILot[]
): ProjectStats {
  const totalLots = projectLots.length;
  const completedLots = projectLots.filter(lot => lot.result === 'pass').length;
  const inProgressLots = projectLots.filter(
    lot => lot.status === '진행중' && (!lot.result || lot.result !== 'pass')
  ).length;

  // processStatusData 관련 로직 삭제

  return { totalLots, completedLots, inProgressLots }; // processStatusData 반환에서 삭제
}

interface ProjectImageDisplayProps {
  imageUrl?: string | null;
  projectName: string;
}

const ProjectImageDisplay: React.FC<ProjectImageDisplayProps> = ({ imageUrl, projectName }) => (
  <div
    style={{
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{ width: '200px', height: '200px', position: 'relative', overflow: 'hidden' }}>
      <Image src={imageUrl || ImgNoImg.src} alt={projectName} layout="fill" objectFit="cover" />
    </div>
  </div>
);

interface ProjectInfoDisplayProps {
  project: IProject;
}

const ProjectInfoDisplay: React.FC<ProjectInfoDisplayProps> = ({ project }) => (
  <div style={{ flex: 1 }}>
    <h3 style={{ marginBottom: '10px' }}>{project.name}</h3>

    <p style={{ marginBottom: '20px' }}>{project.description}</p>

    <Table>
      <tbody>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>차종:</td>
          <td>{project.carType || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>부품:</td>
          <td>{project.part || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>수량:</td>
          <td>{project.quantity || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>이벤트:</td>
          <td>{project.event || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>기간:</td>
          <td>
            {new Date(project.startDate).toLocaleDateString()} ~{' '}
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : '진행중'}
          </td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold' }}>상태:</td>
          <td>{project.status}</td>
        </tr>
      </tbody>
    </Table>
  </div>
);

interface IOverviewTabProps {
  project: IProject;
  projectProcesses: IProcess[];
  lotProcesses: ILotProcess[];
  projectLots: ILot[];
  handleLotClick: (lotId: string) => void; // 이 prop은 현재 사용되지 않습니다.
}

export default function OverviewTab({
  project,
  projectProcesses,
  lotProcesses,
  projectLots,
}: // handleLotClick, // 현재 사용되지 않으므로 주석 처리
IOverviewTabProps) {
  // useProjectOverviewStats hook에서 processStatusData 관련 부분 삭제
  const {
    /* totalLots, completedLots, inProgressLots */
  } = useProjectOverviewStats(projectProcesses, lotProcesses, projectLots);

  // chartOptions 및 관련 로직 전체 삭제

  console.log(project);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="box" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <ProjectImageDisplay imageUrl={project.imageUrl} projectName={project.name} />
          <ProjectInfoDisplay project={project} />
        </div>
      </div>
    </div>
  );
}
