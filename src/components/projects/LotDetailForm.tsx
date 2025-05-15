'use client';

import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation'; // 삭제
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

import styles from './Project.module.css';

import { ILot, IProcess, ILotProcess } from '@interfaces/index'; // ILotProcess 추가

import lotsData from '../../data/lots.json';
import processesData from '../../data/processes.json';
import lotProcessesData from '../../data/lotProcesses.json';

// Props 인터페이스 정의
interface ILotDetailFormProps {
  lotId: string;
  projectId: string;
}

export default function LotDetailForm({ lotId, projectId }: ILotDetailFormProps) {
  // Props 사용
  // const searchParams = useSearchParams(); // 삭제
  const [lot, setLot] = useState<ILot | null>(null);
  // const [projectId, setProjectId] = useState<string>(''); // Props로 받으므로 삭제
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // const lotId = searchParams.get('id'); // Props로 받으므로 삭제
    if (!lotId) return;

    const foundLot = (lotsData as ILot[]).find(l => l.id === lotId);
    if (foundLot) {
      setLot(foundLot);
      // setProjectId(foundLot.project); // Props로 받으므로 삭제. projectId prop 사용
    }
  }, [lotId]); // searchParams 대신 lotId를 의존성 배열에 추가

  // 해당 LOT에 대한 공정별 결과를 lotProcesses에서 찾음
  const currentLotProcesses = lot
    ? (lotProcessesData as ILotProcess[]).filter(lp => lp.lot === lot.id)
    : []; // 타입 ILotProcess[]로 명시

  // 해당 프로젝트의 공정 목록
  const projectProcesses = projectId
    ? (processesData as IProcess[])
        .filter(process => process.project === projectId)
        .sort((a, b) => a.order - b.order)
    : [];

  if (!lot) {
    return (
      <div className="column">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2>LOT 상세</h2>
        </div>

        <div className="box" style={{ padding: '20px' }}>
          <p>LOT를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="column">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>LOT 상세</h2>
      </div>

      <div className="box" style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h6 style={{}}>{lot.code}</h6>

          <button type="button" className="deleteBtn">
            LOT 삭제
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <ul className={styles.lotProcess}>
            {projectProcesses.map(process => {
              const lotProcess = currentLotProcesses.find(lp => lp.process === process.id);

              return (
                <li key={process.id}>
                  <span style={{ flex: 1 }}>{process.name}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className={`${styles.statusBadge} ${
                        lotProcess?.result === 'pass' || lotProcess?.result === '합격' // 'pass'와 '합격'을 OR 조건으로 처리
                          ? styles.statusPass
                          : lotProcess?.result === 'fail' || lotProcess?.result === '불합격' // 'fail'과 '불합격'을 OR 조건으로 처리
                          ? styles.statusFail
                          : lotProcess?.status === 'start' || lotProcess?.result === '진행중' // 'start'와 '진행중'을 OR 조건으로 처리
                          ? styles.statusStart
                          : styles.statusDefault
                      }`}
                    >
                      {lotProcess?.result || lotProcess?.status || '대기'}
                    </span>

                    {lotProcess?.imageUrl && (
                      <Image
                        src={lotProcess.imageUrl}
                        alt={`${process.name} 이미지`}
                        width={24}
                        height={24}
                        style={{
                          cursor: 'pointer',
                          border:
                            selectedImage === lotProcess.imageUrl
                              ? '2px solid #007bff'
                              : '2px solid transparent',
                          borderRadius: '4px',
                        }}
                        onClick={() => setSelectedImage(lotProcess.imageUrl)}
                      />
                    )}
                  </div>
                </li>
              );
            })}

            <li>
              <span style={{ flex: 1 }}>출하일</span>
              <span
                className={`${styles.statusBadge} ${
                  lot.endDate ? styles.statusPass : styles.statusDefault
                }`}
                style={{ flex: 1 }}
              >
                {lot.endDate ? new Date(lot.endDate).toLocaleDateString() : '대기'}
              </span>
            </li>

            <li>
              <span style={{ flex: 1 }}>처리결과</span>
              <span
                className={`${styles.statusBadge} ${
                  lot.result === 'pass'
                    ? styles.statusPass
                    : lot.result === 'fail'
                    ? styles.statusFail
                    : styles.statusDefault
                }`}
                style={{ flex: 1 }}
              >
                {lot.result || '대기'}
              </span>
            </li>
          </ul>

          <div>
            {selectedImage && (
              <div className={styles.imagePreviewContainer}>
                <div className={styles.imagePreviewActions}>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className={styles.iconButton}
                    title="닫기"
                  >
                    <XMarkIcon className={styles.icon} />
                  </button>
                </div>

                <Image
                  src={selectedImage}
                  alt="확대된 프로세스 이미지"
                  width={400}
                  height={400}
                  className={styles.previewImage}
                  onClick={() => window.open(selectedImage, '_blank')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
