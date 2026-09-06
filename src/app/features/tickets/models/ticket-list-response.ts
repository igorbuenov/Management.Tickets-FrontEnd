import { TicketModel } from './ticket';

export interface TicketListResponseModel {
  items: TicketModel[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}