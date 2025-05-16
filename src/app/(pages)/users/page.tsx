'use client';

import { useState, useEffect, useRef } from 'react';
import {
  UserIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import usersData from '@data/users.json';
import SearchBar from '@components/SearchBar';

import Table from '@components/Table';
import EditModal from '@components/EditModal';
import { UserEditForm } from '@components/users/UserEditForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import { hideBackdrop, showBackdrop } from '@redux/slices/backdropSlice';
import Modal from '@components/Modal';

interface IUser {
  id?: number;
  email: string;
  name: string;
  role: string;
  password?: string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

type SortField = keyof IUser;

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isVisible: isBackdropVisible } = useSelector((state: RootState) => state.backdrop);
  const [users, setUsers] = useState<IUser[]>(usersData);
  const [appliedSearchText, setAppliedSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [sortField, setSortField] = useState<SortField | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 10;

  const handleSearch = (newSearchText: string) => {
    setAppliedSearchText(newSearchText);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch =
      appliedSearchText === '' ||
      user.name.toLowerCase().includes(appliedSearchText.toLowerCase()) ||
      user.email.toLowerCase().includes(appliedSearchText.toLowerCase());

    return nameMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === 'createdAt') {
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

  const displayedUsers = sortedUsers.slice(0, page * ITEMS_PER_PAGE);

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
    };
  }, [hasMore]);

  useEffect(() => {
    setHasMore(displayedUsers.length < sortedUsers.length);
  }, [displayedUsers.length, sortedUsers.length]);

  const handleAddUser = () => {
    setCurrentUser(null);
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleEditUser = (user: IUser) => {
    setCurrentUser(user);
    dispatch(showBackdrop());
    setIsModalVisible(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSubmitUser = (userData: IUser) => {
    if (currentUser) {
      // Edit existing user
      setUsers(
        users.map(user =>
          user.id === currentUser.id
            ? {
                ...user,
                ...userData,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id || 0)) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
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
        <h2 className="text-2xl font-bold flex items-center">사용자 관리</h2>
      </div>

      <div className="mb-6">
        <SearchBar
          label="사용자"
          placeholder="사용자 이름, 이메일을 입력하세요."
          onSearch={handleSearch}
          onClickAdd={handleAddUser}
          isAddButtonVisible={true}
        />
      </div>

      <div className="box">
        <Table>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '35%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
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
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  이메일
                  {sortField === 'email' ? (
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
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  역할
                  {sortField === 'role' ? (
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
                onClick={() => handleSort('createdAt')}
                colSpan={2}
              >
                <div className="flex items-center" style={{ display: 'flex', gap: 10 }}>
                  생성일
                  {sortField === 'createdAt' ? (
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
            {displayedUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(user.createdAt || '').toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <button
                    onClick={() => handleEditUser(user)}
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
          <UserEditForm
            back={() => setIsModalVisible(false)}
            user={currentUser}
            onSubmit={handleSubmitUser}
            onDelete={currentUser ? () => handleDeleteUser(currentUser.id || 0) : undefined}
          />
        </Modal>
      )}
    </div>
  );
}
