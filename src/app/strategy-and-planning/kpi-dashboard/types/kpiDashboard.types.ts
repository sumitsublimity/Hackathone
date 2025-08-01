export type ModalType =
  | "privateIncome"
  | "payroll"
  | "cashOut"
  | "savings"
  | "cashInSales"
  | "spendingOnBudget";

export interface KPIDashboardModalProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  siteID: string;
  year: string;
}
export interface Payroll {
  payroll: number;
  paye: number;
  pension: number;
}

export interface PrivateIncome {
  privateIncome: number;
  threeYearFunding: number;
  twoYearFunding: number;
  senif: number;
  daf: number;
}

export interface KPIDashboardEntry {
  year: number;
  month: string;
  cashInSales: number;
  cashOut: number;
  payroll: Payroll;
  privateIncome: PrivateIncome;
  savings: number;
  spendOnBudget: number;
  totalHoursSold: number;
  totalPrivateIncome: number;
  totalPayroll: number;
  turnOverRatio: number;
  costPerHour: number;
  profit: number;
  rev: number;
  difference: number;
  margin: number;
  cashCollectedTurnOver: number;
}

export interface KPIDashboardResponse {
  errorCode: number;
  success: boolean;
  responsePacket: KPIDashboardEntry[];
}

export interface TableRowConfig<T> {
  label: string;
  getValue: (entry: T) => number | undefined;
  format?: (value: number | string | null | undefined) => string;
}

export interface KPIDashboardTableProps {
  data: KPIDashboardEntry[];
  rows: TableRowConfig<KPIDashboardEntry>[];
  showHeaders?: boolean;
  showGrandTotal?: boolean;
  grandTotalLabel?: string;
  grandTotal?: string;
  rowToSumLabel?: string;
}
