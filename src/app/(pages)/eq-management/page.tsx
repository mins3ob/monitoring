'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PencilSquareIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import SearchBar from '@components/SearchBar';
import Table from '@components/Table';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';
import Modal from '@components/Modal';
import { EQEditForm } from '@components/eq/EQEditForm';
import eqBoardsData from '@data/eq_boards.json';

interface EQBoard {
  id: string;
  name: string;
  pc: string;
  type: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

type SortField = keyof EQBoard;

export default function EQManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isVisible: isBackdropVisible } = useSelector((state: RootState) => state.backdrop);
  const [eqBoards, setEqBoards] = useState<EQBoard[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [appliedSearchText, setAppliedSearchText] = useState<string>('');
  const [appliedSearchType, setAppliedSearchType] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentEQ, setCurrentEQ] = useState<EQBoard | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [sortField, setSortField] = useState<SortField | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setEqBoards(eqBoardsData);
  }, []);

  const handleSearch = (newSearchText: string, newSearchType?: string) => {
    setAppliedSearchText(newSearchText);
    setAppliedSearchType(newSearchType || '');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEQs = eqBoards.filter(eq => {
    const nameMatch =
      appliedSearchText === '' ||
      eq.name.toLowerCase().includes(appliedSearchText.toLowerCase()) ||
      eq.pc.toLowerCase().includes(appliedSearchText.toLowerCase());

    const typeMatch =
      appliedSearchType === '' || eq.type.toLowerCase().includes(appliedSearchType.toLowerCase());

    return nameMatch && typeMatch;
  });

  const sortedEQs = [...filteredEQs].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === 'created_at') {
      if (!aValue || !bValue) return 0;
      return sortDirection === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const displayedEQs = sortedEQs.slice(0, page * ITEMS_PER_PAGE);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverTarget = observerTarget.current;
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
      observer.disconnect();
    };
  }, [hasMore]);

  useEffect(() => {
    setHasMore(displayedEQs.length < sortedEQs.length);
  }, [displayedEQs.length, sortedEQs.length]);

  const handleAddEQ = () => {
    setCurrentEQ(null);
    setModalTitle('새 EQ 추가');
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleEditEQ = (eq: EQBoard) => {
    setCurrentEQ(eq);
    setModalTitle('EQ 정보 수정');
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleDeleteEQ = (eqId: string) => {
    if (window.confirm('정말로 이 EQ를 삭제하시겠습니까?')) {
      setEqBoards(eqBoards.filter(eq => eq.id !== eqId));
    }
  };

  const handleSubmitEQ = (eqData: Partial<EQBoard>) => {
    // 필수 필드 검증
    if (!eqData.name || !eqData.pc || !eqData.type || !eqData.file_url) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (currentEQ) {
      // Edit existing EQ
      setEqBoards(
        eqBoards.map(eq =>
          eq.id === currentEQ.id
            ? {
                ...eq,
                ...eqData,
                updated_at: new Date().toISOString(),
              }
            : eq
        )
      );
    } else {
      // Add new EQ
      const newEQ = {
        ...eqData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as EQBoard;
      setEqBoards([...eqBoards, newEQ]);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!isBackdropVisible) {
      setIsModalVisible(false);
    }
  }, [isBackdropVisible]);

  useEffect(() => {
    if (!isModalVisible) {
      dispatch(hideBackdrop());
    }
  }, [isModalVisible, dispatch]);

  useEffect(() => {
    const handleBackdropClick = () => {
      setIsModalVisible(false);
    };

    const backdrop = document.querySelector('.backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', handleBackdropClick);
    }

    return () => {
      if (backdrop) {
        backdrop.removeEventListener('click', handleBackdropClick);
      }
    };
  }, []);

  return (
    <div className="column">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">EQ 관리</h2>
      </div>

      <div className="mb-6">
        <SearchBar
          label="EQ"
          placeholder="EQ 이름, PC를 입력하세요."
          onSearch={handleSearch}
          onClickAdd={handleAddEQ}
          isAddButtonVisible={true}
          extraInput={{
            value: searchType,
            onChange: setSearchType,
            placeholder: '타입을 입력하세요.',
            label: '타입',
          }}
          initialSearchText={searchText}
        />
      </div>

      <div className="box">
        <Table>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  이름
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ChevronUpIcon className="ml-1 h-4 w-4 text-gray-300" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('pc')}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  PC
                  {sortField === 'pc' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ChevronUpIcon className="ml-1 h-4 w-4 text-gray-300" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  타입
                  {sortField === 'type' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ChevronUpIcon className="ml-1 h-4 w-4 text-gray-300" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
                colSpan={2}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  생성일
                  {sortField === 'created_at' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUpIcon className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ChevronUpIcon className="ml-1 h-4 w-4 text-gray-300" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedEQs.map(eq => (
              <tr key={eq.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <a
                    href={eq.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {eq.name}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {eq.pc}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {eq.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(eq.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <button
                    onClick={() => handleEditEQ(eq)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoading && <div className="text-gray-500">로딩 중...</div>}
        </div>
      </div>

      {isModalVisible && (
        <Modal>
          <EQEditForm
            back={() => setIsModalVisible(false)}
            eq={currentEQ}
            onSubmit={handleSubmitEQ}
            onDelete={currentEQ ? () => handleDeleteEQ(currentEQ.id) : undefined}
          />
        </Modal>
      )}
    </div>
  );
}
