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
  quantity: string;
}

export interface IProcess {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl: string | null;
  order: number;
  barcode: string;
  createdAt: string;
  updatedAt: string;
  project: string;
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
}

export interface ILotProcess {
  id: string;
  status: string;
  result: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  date: string;
  lot: string;
  process: string;
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
