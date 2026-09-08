export interface UserSummaryModel {
  id: number;
  name: string;
}

export interface TicketModel {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  priority: string;
  status: string;

  createdBy: UserSummaryModel;
  assignedTo: UserSummaryModel | null;
}

