export interface TicketModel {
  createdAt: string;
  updatedAt: string | null;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdByUserId: number;
  assignedToUserId: number | null;
}