'use client';

import React, { useEffect, useState, useMemo } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@redux/store';

import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';

import dummyData from '@constants/erd_dummy_data.json';

import { IProject, IProcess, ILot, ILotProcess } from '@interfaces/index';

import Modal from '@components/Modal';

import ImgNoImg from '@public/imgs/img_no_img.png';
import LotAddForm from '@components/forms/LotAddForm';
import { PROCESS_RESULT_COLORS, QUALITY_RESULT_COLORS } from '@constants/color';

interface IDetailForm {
  projectId: string;
}

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DetailForm({ projectId }: IDetailForm) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isVisible } = useSelector((state: RootState) => state.backdrop);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const project = useMemo(() => {
    return (dummyData.projects as IProject[]).find(p => p.id === projectId);
  }, [projectId]);

  const projectProcesses = useMemo(() => {
    return (dummyData.processes as IProcess[])
      .filter(process => process.project === projectId)
      .sort((a, b) => a.order - b.order);
  }, [projectId]);

  const projectLots = useMemo(() => {
    return (dummyData.lots as ILot[]).filter(lot => lot.project === projectId);
  }, [projectId]);

  const lotProcesses = useMemo(() => {
    return (dummyData.lotProcesses as ILotProcess[]).filter(lp =>
      projectLots.some(lot => lot.id === lp.lot)
    );
  }, [projectLots]);

  const clickAddLot = (): void => {
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleLotClick = (lotId: string): void => {
    router.push(`/project?view=lot&id=${lotId}`);
  };

  useEffect(() => {
    if (!isVisible) setIsModalVisible(false);
  }, [isVisible]);

  useEffect(() => {
    if (!isModalVisible) dispatch(hideBackdrop());
  }, [isModalVisible, dispatch]);

  if (!project) {
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
          <h2>프로젝트 상세</h2>
        </div>

        <div className="box" style={{ padding: '20px' }}>
          <p>프로젝트를 찾을 수 없습니다.</p>
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
        <h2>프로젝트 상세</h2>
      </div>

      <div className="box" style={{ padding: '20px' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h3>{project.name}</h3>

              <button type="button" onClick={clickAddLot}>
                LOT 추가
              </button>
            </div>

            <div
              style={{ width: '100%', height: '300px', marginBottom: '20px', position: 'relative' }}
            >
              <Image
                src={project.imageUrl || ImgNoImg.src}
                alt={project.name}
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            </div>

            <p style={{ fontSize: '16px' }}>{project.description}</p>
          </div>
        </div>

        <div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid var(--gray-200)',
            }}
          >
            <thead>
              <tr>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  LOT NO.
                </th>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  사양
                </th>
                <th
                  colSpan={projectProcesses.length}
                  style={{ border: '1px solid var(--gray-200)', padding: '8px' }}
                >
                  공정 작업 결과
                </th>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  시작일
                </th>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  처리결과
                </th>
              </tr>

              <tr>
                {projectProcesses.map(process => (
                  <th
                    key={process.id}
                    style={{ border: '1px solid var(--gray-200)', padding: '8px' }}
                  >
                    {process.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projectLots.map(lot => (
                <tr key={lot.id}>
                  <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handleLotClick(lot.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      {lot.code}
                    </a>
                  </td>
                  <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                    {lot.status}
                  </td>
                  {projectProcesses.map(process => {
                    const lotProcess = lotProcesses.find(
                      lp => lp.lot === lot.id && lp.process === process.id
                    );
                    return (
                      <td
                        key={process.id}
                        style={{
                          border: '1px solid var(--gray-200)',
                          padding: '8px',
                          color:
                            lotProcess?.result === 'pass'
                              ? 'var(--success-color)'
                              : lotProcess?.result === 'fail'
                              ? 'var(--error-color)'
                              : lotProcess?.status === 'start'
                              ? 'var(--warning-color)'
                              : 'var(--gray-400)',
                        }}
                      >
                        {lotProcess?.result || lotProcess?.status || '대기'}
                      </td>
                    );
                  })}
                  <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                    {lot.startDate ? new Date(lot.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td
                    style={{
                      border: '1px solid var(--gray-200)',
                      padding: '8px',
                      color:
                        lot.result === 'pass'
                          ? 'var(--success-color)'
                          : lot.result === 'fail'
                          ? 'var(--error-color)'
                          : 'var(--gray-400)',
                    }}
                  >
                    {lot.result || '대기'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ flex: 1 }}>
              <h3>공정 처리 결과</h3>

              <div style={{ height: '300px' }}>
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
              <div style={{ height: '300px' }}>
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
      </div>

      {isModalVisible && (
        <Modal>
          <LotAddForm back={() => setIsModalVisible(false)} />
        </Modal>
      )}
    </div>
  );
}
