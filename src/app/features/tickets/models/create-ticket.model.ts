import { TicketModel } from "./ticket";

export interface CreateTicket {
    title: string,
    description: string,
    priority: number,
    departmentId: number,
    categoryId: number
}

export interface CreateTicketResponseModel {
  success: boolean;
  ticket: TicketModel;
}
