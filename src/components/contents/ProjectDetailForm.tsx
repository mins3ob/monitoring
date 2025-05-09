'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import CSS from './Contents.module.css';

import projectData from '@constants/testProject.json';

import { IProcess, IProject, ILot } from '@interfaces/index';

import processData from '@constants/testProcess.json';

import lotData from '@constants/testLot.json';

import ImgNoImg from '@public/imgs/img_no_img.png';

interface ProjectDetailFormProps {
  onBack: () => void;

  projectId: string;
}

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProjectDetailForm({ onBack, projectId }: ProjectDetailFormProps) {
  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    const foundProject = projectData.find(p => p.id === projectId);
    if (foundProject) setProject(foundProject);
  }, [projectId]);

  if (!project) {
    return (
      <div className={CSS.column}>
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

        <div className={CSS.box} style={{ padding: '20px' }}>
          <p>프로젝트를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  console.log(project);

  return (
    <div className={CSS.column}>
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

      <div className={CSS.box} style={{ padding: '20px' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}
        >
          <div>
            <h3>{project.name}</h3>

            <div style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
              <img
                src={project.imgUrl || ImgNoImg.src}
                alt={project.name}
                style={{
                  width: '100%',
                  height: '100%',
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
                  colSpan={(processData as Record<string, IProcess[]>)[project.id].length}
                  style={{ border: '1px solid var(--gray-200)', padding: '8px' }}
                >
                  공정 작업 결과
                </th>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  출하일
                </th>
                <th rowSpan={2} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                  처리결과
                </th>
              </tr>

              <tr>
                {(processData as Record<string, IProcess[]>)[project.id].map((process, idx) => (
                  <th key={idx} style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                    {process.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values((lotData as Record<string, Record<string, ILot[]>>)[project.id] || {})
                .flat()
                .map(lot => (
                  <tr key={lot.id}>
                    <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                      {lot.lotNo}
                    </td>
                    <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                      {lot.specification}
                    </td>
                    {(processData as Record<string, IProcess[]>)[project.id].map(process => (
                      <td
                        key={process.id}
                        style={{
                          border: '1px solid var(--gray-200)',
                          padding: '8px',
                          color:
                            lot.processResults[process.id] === '성공' ||
                            lot.processResults[process.id] === '합격'
                              ? 'var(--success-color)'
                              : lot.processResults[process.id] === '실패' ||
                                lot.processResults[process.id] === '불합격'
                              ? 'var(--error-color)'
                              : lot.processResults[process.id] === '진행중'
                              ? 'var(--warning-color)'
                              : 'var(--gray-400)',
                        }}
                      >
                        {lot.processResults[process.id]}
                      </td>
                    ))}
                    <td style={{ border: '1px solid var(--gray-200)', padding: '8px' }}>
                      {lot.attendanceDate || '-'}
                    </td>
                    <td
                      style={{
                        border: '1px solid var(--gray-200)',
                        padding: '8px',
                        color:
                          lot.result === '납품'
                            ? 'var(--success-color)'
                            : lot.result === '폐기'
                            ? 'var(--error-color)'
                            : lot.result === '설계 샘플'
                            ? 'var(--warning-color)'
                            : 'var(--gray-400)',
                      }}
                    >
                      {lot.result}
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
                      name: '성공',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot => Object.values(lot.processResults).some(r => r === '성공'))
                          .length,
                      ],
                    },
                    {
                      name: '실패',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot => Object.values(lot.processResults).some(r => r === '실패'))
                          .length,
                      ],
                    },
                    {
                      name: '진행중',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot =>
                            Object.values(lot.processResults).some(r => r === '진행중')
                          ).length,
                      ],
                    },
                    {
                      name: '대기',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot => Object.values(lot.processResults).some(r => r === '대기'))
                          .length,
                      ],
                    },
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                    },
                    colors: [
                      'var(--success-color)',
                      'var(--error-color)',
                      'var(--warning-color)',
                      'var(--gray-400)',
                    ],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        distributed: true,
                      },
                    },
                    xaxis: {
                      categories: ['처리결과'],
                    },
                    legend: {
                      position: 'top',
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
                      name: '합격',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot => Object.values(lot.processResults).some(r => r === '합격'))
                          .length,
                      ],
                    },
                    {
                      name: '불합격',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot =>
                            Object.values(lot.processResults).some(r => r === '불합격')
                          ).length,
                      ],
                    },
                    {
                      name: '대기',
                      data: [
                        Object.values(
                          (lotData as Record<string, Record<string, ILot[]>>)[project.id] || {}
                        )
                          .flat()
                          .filter(lot => Object.values(lot.processResults).some(r => r === '대기'))
                          .length,
                      ],
                    },
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                    },
                    colors: ['var(--success-color)', 'var(--error-color)', 'var(--gray-400)'],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        distributed: true,
                      },
                    },
                    xaxis: {
                      categories: ['검사결과'],
                    },
                    legend: {
                      position: 'top',
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
