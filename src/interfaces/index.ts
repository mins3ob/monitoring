export interface IProject {
  id: string;
  name: string;
  status: string;
  imgUrl: string | null;
  description: string;
  lot: number;
  success: number;
  failed: number;
  processIds: string[];
}

export interface IProcess {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

export interface ILot {
  id: string;
  lotNo: string;
  specification: string;
  attendanceDate: string | null;
  result: string;
  processResults: Record<string, string>;
}
