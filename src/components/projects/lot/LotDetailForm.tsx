'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  ArrowsPointingOutIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

import styles from './LotDetail.module.css';

import { ILot, ILotProcess } from '@interfaces/index';

import lotsData from '../../../data/lots.json';
import processesData from '../../../data/processes.json';
import lotProcessesData from '../../../data/lot_processes.json';

interface ILotDetailFormProps {
  lotId: string;
  setSelectedLotId: (lotId: string | null) => void;
}

export default function LotDetailForm({ lotId, setSelectedLotId }: ILotDetailFormProps) {
  const [lot, setLot] = useState<ILot | null>(null);
  const [projectId, setProjectId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!lotId) return;

    const foundLot = lotsData.find(l => l.id === lotId);
    if (foundLot) {
      setLot(foundLot);
      setProjectId(foundLot.project);
    }
  }, [lotId]);

  // 해당 LOT에 대한 공정별 결과를 lotProcesses에서 찾음
  const lotProcesses = lot ? lotProcessesData.filter((lp: ILotProcess) => lp.lotId === lot.id) : [];

  // 해당 프로젝트의 공정 목록
  const projectProcesses = projectId
    ? processesData
        .filter(process => process.project === projectId)
        .sort((a, b) => a.order - b.order)
    : [];

  if (!lot) {
    return (
      <div className="column">
        <div className="box" style={{ padding: '20px' }}>
          <div className="flex items-center gap-2 text-gray-500">
            <DocumentIcon className="w-5 h-5" />
            <p>LOT를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (result?: string, status?: string) => {
    if (result === 'pass') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    if (result === 'fail') {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
    if (status === 'start' || status === 'progress') {
      return <ClockIcon className="w-5 h-5 text-blue-500" />;
    }
    return <ClockIcon className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="column">
      <div
        className="box"
        style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedLotId(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="p-2 bg-blue-50 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h6 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem' }}>{lot.code}</h6>
              <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                {lot.startDate ? new Date(lot.startDate).toLocaleDateString() : '날짜 없음'}
              </p>
            </div>
          </div>

          <button type="button" className="deleteBtn">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="flex items-center gap-2 mb-20" style={{ marginBottom: 20 }}>
              <div className="p-2 bg-gray-50 rounded-lg">
                <DocumentIcon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 style={{ margin: 0, color: '#1f2937' }}>공정별 결과</h3>
            </div>
            <ul className={styles.lotProcess} style={{ padding: 0, margin: 0 }}>
              {projectProcesses.map(process => {
                const lotProcess = lotProcesses.find(lp => lp.processId === process.id);

                return (
                  <li
                    key={process.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#1f2937', fontWeight: 500 }}>{process.name}</span>
                        {lotProcess?.imageUrl ? (
                          <Image
                            src={lotProcess.imageUrl}
                            alt={`${process.name} 썸네일`}
                            width={32}
                            height={32}
                            style={{
                              objectFit: 'cover',
                              aspectRatio: '1 / 1',
                              borderRadius: '6px',
                              border:
                                selectedImage === lotProcess.imageUrl
                                  ? '2px solid #3b82f6'
                                  : '1px solid #e5e7eb',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              marginLeft: '8px',
                            }}
                            onClick={() => setSelectedImage(lotProcess.imageUrl)}
                          />
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(lotProcess?.result, lotProcess?.status)}
                        <span
                          className={`${styles.statusBadge} ${
                            lotProcess?.result === 'pass'
                              ? styles.statusPass
                              : lotProcess?.result === 'fail'
                              ? styles.statusFail
                              : lotProcess?.status === 'start'
                              ? styles.statusStart
                              : styles.statusDefault
                          }`}
                        >
                          {lotProcess?.result || lotProcess?.status || '대기'}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {selectedImage ? (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                minHeight: '400px',
                border: '1px solid #e5e7eb',
              }}
            >
              <Image
                src={selectedImage}
                alt="확대된 프로세스 이미지"
                width={400}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/img_no_img.png';
                }}
              />
              <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedImage) {
                      window.open(selectedImage, '_blank');
                    }
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  className="hover:bg-opacity-80"
                >
                  <ArrowsPointingOutIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  className="hover:bg-opacity-80"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '24px',
                minHeight: '400px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Image src="/imgs/img_no_img.png" alt="이미지 없음" width={48} height={48} />
                </div>
                <p style={{ margin: 0 }}>이미지를 선택하면 여기에 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
