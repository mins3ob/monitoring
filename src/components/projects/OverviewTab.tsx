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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '280px',
      height: '280px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
    }}
  >
    <Image
      src={imageUrl || ImgNoImg.src}
      alt={projectName}
      layout="fill"
      objectFit="cover"
      style={{
        transition: 'transform 0.2s ease-in-out',
      }}
    />
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
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>차종:</td>
          <td>{project.carType || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>부품:</td>
          <td>{project.part || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>수량:</td>
          <td>{project.quantity || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>이벤트:</td>
          <td>{project.event || '-'}</td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>기간:</td>
          <td>
            {new Date(project.startDate).toLocaleDateString()} ~{' '}
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : '진행중'}
          </td>
        </tr>
        <tr>
          <td style={{ paddingRight: '10px', fontWeight: 'bold', textAlign: 'left' }}>상태:</td>
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
  const { totalLots, completedLots, inProgressLots } = useProjectOverviewStats(
    projectProcesses,
    lotProcesses,
    projectLots
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
      }}
    >
      <div
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginBottom: '24px',
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <ProjectImageDisplay imageUrl={project.imageUrl} projectName={project.name} />
          <ProjectInfoDisplay project={project} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>전체 LOT</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{totalLots}</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>완료된 LOT</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#059669' }}>
              {completedLots}
            </p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>진행중인 LOT</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>
              {inProgressLots}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
