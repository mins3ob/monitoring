'use client';

import React from 'react';
import { ILot, ILotProcess } from '@interfaces/index';
import Table from '@components/Table';
import LotDetailForm from './LotDetailForm';
import { PROCESS_RESULT_COLORS, QUALITY_RESULT_COLORS } from '@constants/color';
import Image from 'next/image';
import ImgNoImg from '@public/imgs/img_no_img.png';
import styles from './Project.module.css';

interface ILotHistoryTabProps {
  projectLots: ILot[];
  lotProcesses: ILotProcess[];
  handleLotClick: (lotId: string) => void;
  clickAddLot: () => void;
  selectedLotId: string | null;
  setSelectedLotId: (lotId: string | null) => void;
  projectId: string;
}

export default function LotHistoryTab({
  projectLots,
  lotProcesses,
  handleLotClick,
  clickAddLot,
  selectedLotId,
  setSelectedLotId,
  projectId,
}: ILotHistoryTabProps) {
  const lotColumnInfos = [
    { header: 'Lot ID', accessor: 'id' },
    { header: '완료된 공정 수', accessor: 'completedProcesses' },
    { header: '최종 공정 결과', accessor: 'lastProcessResult' },
    { header: '품질 검사 결과', accessor: 'qualityResult' },
    { header: '생성일', accessor: 'createdAt' },
    { header: '최종 업데이트일', accessor: 'updatedAt' },
  ];

  const lotTableData = projectLots.map(lot => {
    const relatedProcesses = lotProcesses.filter(lp => lp.lot === lot.id);
    const completedProcesses = relatedProcesses.filter(lp => lp.status === '완료').length;
    const lastProcess = relatedProcesses.sort(
      (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )[0];

    return {
      id: lot.id,
      code: lot.code,
      completedProcesses: `${completedProcesses} / ${relatedProcesses.length}`,
      lastProcessResult: lastProcess ? (
        <span
          style={{
            color:
              PROCESS_RESULT_COLORS[lastProcess.result as keyof typeof PROCESS_RESULT_COLORS] ||
              '#000',
            fontWeight: 'bold',
          }}
        >
          {lastProcess.result || '-'}
        </span>
      ) : (
        '-'
      ),
      qualityResult: lot.result ? (
        <span
          style={{
            color:
              QUALITY_RESULT_COLORS[lot.result as keyof typeof QUALITY_RESULT_COLORS] || '#000',
            fontWeight: 'bold',
          }}
        >
          {lot.result}
        </span>
      ) : (
        '-'
      ),
      createdAt: new Date(lot.createdAt).toLocaleString(),
      updatedAt: new Date(lot.updatedAt).toLocaleString(),
    };
  });

  if (selectedLotId) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedLotId(null)}
          style={{ marginBottom: '20px' }}
          className="button gray"
        >
          목록으로 돌아가기
        </button>
        <LotDetailForm lotId={selectedLotId} projectId={projectId} />
      </div>
    );
  }

  return (
    <div className="box" style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3>Lot 이력</h3>
        <button type="button" onClick={clickAddLot} className="button gray">
          Lot 추가
        </button>
      </div>
      {projectLots.length > 0 ? (
        <Table>
          <thead>
            <tr>
              {lotColumnInfos.map(col => (
                <th
                  key={col.accessor}
                  style={{ border: '1px solid var(--gray-200)', padding: '8px' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lotTableData.map(lotData => (
              <tr
                key={lotData.id}
                onClick={() => handleLotClick(lotData.id)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.id}
                </td>
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.completedProcesses}
                </td>
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.lastProcessResult}
                </td>
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.qualityResult}
                </td>
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.createdAt}
                </td>
                <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  {lotData.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Image src={ImgNoImg} alt="No Lots" width={100} height={100} />
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>
            아직 생성된 Lot이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
