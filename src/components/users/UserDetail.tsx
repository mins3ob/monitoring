import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface UserDetailProps {
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    department: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function UserDetail({ user }: UserDetailProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <UserIcon className="h-12 w-12 text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.username}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span>{user.department}</span>
        </div>
        <div className="flex items-center">
          <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full 
            ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-800'
                : user.role === 'manager'
                ? 'bg-blue-100 text-blue-800'
                : user.role === 'engineer'
                ? 'bg-green-100 text-green-800'
                : user.role === 'quality'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.role === 'admin'
              ? '관리자'
              : user.role === 'manager'
              ? '매니저'
              : user.role === 'engineer'
              ? '엔지니어'
              : user.role === 'quality'
              ? '품질관리'
              : user.role === 'operator'
              ? '작업자'
              : user.role}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <p>생성일</p>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p>최종 수정일</p>
            <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
