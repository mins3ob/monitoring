export interface IProject {
  id: string;
  name: string;
  description: string;
  status: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  event: string;
  carType: string;
  part: string;
  feature: string;
  quantity: number;
}

export interface IProcess {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl: string | null;
  order: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  project: string;
  barcode?: string;
}

export interface ILot {
  id: string;
  code: string;
  status: string;
  result: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  project: string;
  featureId: string;
}

export interface ILotProcess {
  id: string;
  lotId: string;
  processId: string;
  status: string;
  result: string;
  imageUrl: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectWithStats extends IProject {
  lotCount: number;
  successCount: number;
  failCount: number;
  processes: IProcess[];
}

export interface IPartInventory {
  id: string;
  name: string;
  quantity: number;
}

export interface IInventory {
  partNo: string;
  partName: string;
  quantity: number;
  process: string;
  company: string;
  incomingQuantity: number;
  lastIncomingDate: string;
  remainingQuantity: number;
  remarks: string;
}

export interface IFeature {
  id: string;
  name: string;
  quantity: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
