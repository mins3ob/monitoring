import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IProjectWithStats } from '@interfaces/index';
import ImgNoImg from '@public/imgs/img_no_img.png';
import styles from './ProjectCard.module.css';
import lotsData from '@data/lots.json';
import processesData from '@data/processes.json';
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: IProjectWithStats;
  actionButtons?: React.ReactNode;
}

interface Process {
  id: string;
  name: string;
  status: string;
  order: number;
  type: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, actionButtons }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`?view=detail&id=${project.id}`);
  };

  // LOT 통계 계산
  const lotStats = lotsData.reduce(
    (acc, lot) => {
      if (lot.project === project.id) {
        acc.total++;
        if (lot.result === 'pass') acc.success++;
        if (lot.result === 'fail') acc.fail++;
      }
      return acc;
    },
    { total: 0, success: 0, fail: 0 }
  );

  // 공정 정보 필터링 및 정렬
  const projectProcesses: Process[] = processesData
    .filter(process => process.project === project.id)
    .sort((a, b) => a.order - b.order);

  // 프로젝트 타입에 따른 아이콘 선택
  const getProjectIcon = () => {
    const firstProcess = projectProcesses[0];
    if (!firstProcess) return <DocumentTextIcon className={styles.defaultIcon} />;

    switch (firstProcess.type) {
      case 'DataCollection':
      case 'DataAnalysis':
        return <ChartBarIcon className={styles.defaultIcon} />;
      case 'AITraining':
      case 'ModelDevelopment':
        return <CpuChipIcon className={styles.defaultIcon} />;
      case 'AlgorithmDesign':
      case 'ModuleDevelopment':
        return <BuildingOfficeIcon className={styles.defaultIcon} />;
      case 'SystemImplementation':
      case 'Prototyping':
        return <WrenchScrewdriverIcon className={styles.defaultIcon} />;
      case 'Simulation':
      case 'FieldTest':
        return <BeakerIcon className={styles.defaultIcon} />;
      default:
        return <DocumentTextIcon className={styles.defaultIcon} />;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              handleCardClick();
            }}
          >
            {project.name}
          </a>
        </h3>
      </div>

      <button type="button" onClick={handleCardClick} className={styles.contentButton}>
        <div className={styles.imageContainer}>
          {project.imageUrl ? (
            <Image src={project.imageUrl} alt={project.name} fill className={styles.image} />
          ) : (
            <div className={styles.iconContainer}>
              <PhotoIcon className={styles.defaultIcon} />
            </div>
          )}
        </div>

        <p className={styles.description}>설명: {project.description}</p>

        <div className={styles.stats}>
          <p>LOT: {lotStats.total}</p>
          <p>성공: {lotStats.success}</p>
          <p>실패: {lotStats.fail}</p>
        </div>

        <div className={styles.processes}>
          <p>공정:</p>
          <ul className={styles.processList}>
            {projectProcesses.map((process, idx) => (
              <React.Fragment key={process.id}>
                <li className={styles.processItem}>{process.name}</li>
                {idx < projectProcesses.length - 1 && (
                  <span className={styles.processArrow}>→</span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </button>

      {actionButtons && <div className={styles.actionButtons}>{actionButtons}</div>}
    </div>
  );
};

export default ProjectCard;
