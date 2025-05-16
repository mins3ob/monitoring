'use client';

import React from 'react';
import { ILot, ILotProcess } from '@interfaces/index';
import Table from '@components/Table';
import LotDetailForm from './LotDetailForm';
import { PROCESS_RESULT_COLORS, QUALITY_RESULT_COLORS } from '@constants/color';
import Image from 'next/image';
import ImgNoImg from '@public/imgs/img_no_img.png';
import lotsData from '@data/lots.json';
import processesData from '@data/processes.json';
import ReactApexChart from 'react-apexcharts';
import { PlusIcon } from '@heroicons/react/24/outline';

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
  // projectId에 해당하는 lot 데이터 필터링
  const filteredLots = lotsData.filter(lot => lot.project === projectId);

  // projectId에 해당하는 process 데이터 필터링
  const filteredProcesses = processesData.filter(process => process.project === projectId);

  if (selectedLotId) {
    return <LotDetailForm lotId={selectedLotId} setSelectedLotId={setSelectedLotId} />;
  }

  return (
    <div className="column">
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
          <button
            type="button"
            onClick={clickAddLot}
            className="button gray"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
            }}
          >
            <PlusIcon className="w-5 h-5" />
            Lot 추가
          </button>
        </div>

        {filteredLots.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th rowSpan={2} style={{ borderBottom: '2px solid var(--table-border-color)' }}>
                    LOT NO.
                  </th>
                  <th rowSpan={2} style={{ borderBottom: '2px solid var(--table-border-color)' }}>
                    사양
                  </th>
                  <th colSpan={filteredProcesses.length}>공정 작업 결과</th>
                  <th rowSpan={2} style={{ borderBottom: '2px solid var(--table-border-color)' }}>
                    출하일
                  </th>
                  <th rowSpan={2} style={{ borderBottom: '2px solid var(--table-border-color)' }}>
                    처리결과
                  </th>
                </tr>

                <tr>
                  {filteredProcesses.map((process, idx) => (
                    <th key={idx}>{process.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLots.map(lot => (
                  <tr key={lot.id}>
                    <td>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          handleLotClick(lot.id);
                        }}
                      >
                        {lot.code}
                      </a>
                    </td>
                    <td>{lot.featureId}</td>
                    {filteredProcesses.map(process => (
                      <td
                        key={process.id}
                        style={{
                          color:
                            lot.status === 'finish' && lot.result === 'pass'
                              ? 'var(--success-color)'
                              : lot.status === 'finish' && lot.result === 'fail'
                              ? 'var(--error-color)'
                              : lot.status === 'progress'
                              ? 'var(--warning-color)'
                              : 'var(--gray-400)',
                        }}
                      >
                        {lot.status === 'finish'
                          ? lot.result === 'pass'
                            ? '성공'
                            : '실패'
                          : lot.status === 'progress'
                          ? '진행중'
                          : '-'}
                      </td>
                    ))}
                    <td>{lot.endDate || '-'}</td>
                    <td
                      style={{
                        color:
                          lot.result === 'pass'
                            ? 'var(--success-color)'
                            : lot.result === 'fail'
                            ? 'var(--error-color)'
                            : lot.status === 'progress'
                            ? 'var(--warning-color)'
                            : 'var(--gray-400)',
                      }}
                    >
                      {lot.result === 'pass'
                        ? '합격'
                        : lot.result === 'fail'
                        ? '불합격'
                        : lot.status === 'progress'
                        ? '진행중'
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
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

      {filteredLots.length > 0 && (
        <div className="box">
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ flex: 1 }}>
              <h3>공정 처리 결과</h3>
              <div>
                <ReactApexChart
                  type="bar"
                  series={[
                    {
                      data: [
                        {
                          x: '성공',
                          y: lotProcesses.filter(lp => lp.result === 'pass').length,
                          fillColor: PROCESS_RESULT_COLORS.SUCCESS,
                        },
                        {
                          x: '실패',
                          y: lotProcesses.filter(lp => lp.result === 'fail').length,
                          fillColor: PROCESS_RESULT_COLORS.FAIL,
                        },
                        {
                          x: '진행중',
                          y: lotProcesses.filter(lp => lp.status === 'start').length,
                          fillColor: PROCESS_RESULT_COLORS.IN_PROGRESS,
                        },
                        {
                          x: '대기',
                          y: lotProcesses.filter(lp => lp.status === 'none').length,
                          fillColor: PROCESS_RESULT_COLORS.WAITING,
                        },
                      ],
                    },
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                    },
                    colors: [
                      PROCESS_RESULT_COLORS.SUCCESS,
                      PROCESS_RESULT_COLORS.FAIL,
                      PROCESS_RESULT_COLORS.IN_PROGRESS,
                      PROCESS_RESULT_COLORS.WAITING,
                    ],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        distributed: true,
                      },
                    },
                    xaxis: {
                      categories: ['성공', '실패', '진행중', '대기'],
                    },
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                        const label = w.globals.labels[dataPointIndex];
                        const value = series[seriesIndex][dataPointIndex];
                        const color = w.config.series[seriesIndex].data[dataPointIndex].fillColor;

                        return `
                  <div style="display: flex; align-items: center; gap: 6px; padding: 5px;">
                    <div style="width: 12px; height: 12px; background: ${color};"></div>
                    <p style="font-size: 12px;">${label}: ${value}건</p>
                  </div>
                `;
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3>품질검사 결과</h3>
              <div>
                <ReactApexChart
                  type="bar"
                  series={[
                    {
                      name: '검사결과',
                      data: [
                        {
                          x: '합격',
                          y: projectLots.filter(lot => lot.result === 'pass').length,
                          fillColor: QUALITY_RESULT_COLORS.PASS,
                        },
                        {
                          x: '불합격',
                          y: projectLots.filter(lot => lot.result === 'fail').length,
                          fillColor: QUALITY_RESULT_COLORS.FAIL,
                        },
                        {
                          x: '대기',
                          y: projectLots.filter(lot => !lot.result).length,
                          fillColor: QUALITY_RESULT_COLORS.WAITING,
                        },
                      ],
                    },
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                    },
                    colors: [
                      QUALITY_RESULT_COLORS.PASS,
                      QUALITY_RESULT_COLORS.FAIL,
                      QUALITY_RESULT_COLORS.WAITING,
                    ],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        distributed: true,
                      },
                    },
                    xaxis: {
                      categories: ['합격', '불합격', '대기'],
                    },
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                        const label = w.globals.labels[dataPointIndex];
                        const value = series[seriesIndex][dataPointIndex];
                        const color = w.config.series[seriesIndex].data[dataPointIndex].fillColor;

                        return `
                   <div style="display: flex; align-items: center; gap: 6px; padding: 5px;">
                     <div style="width: 12px; height: 12px; background: ${color};"></div>

                     <p style="font-size: 12px;">${label}: ${value}건</p>
                   </div>
                 `;
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
