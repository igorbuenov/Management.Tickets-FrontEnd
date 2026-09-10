
export interface UserSummaryModel {
  id: number;
  name: string;
}

export interface CategorySummaryModel {
  id: number;
  name: string;
}

export interface DepartmentSummaryModel {
  id: number;
  name: string;
}

export type TicketPriority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Urgent';

export type TicketStatus =
  | 'Open'
  | 'InProgress'
  | 'Resolved'
  | 'Closed';

export interface TicketModel {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;

  category: CategorySummaryModel;
  department: DepartmentSummaryModel;

  createdBy: UserSummaryModel;
  assignedTo: UserSummaryModel | null;
}
