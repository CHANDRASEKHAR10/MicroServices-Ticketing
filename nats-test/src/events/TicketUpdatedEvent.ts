import { SubjectsEnum } from "./subjects";

export interface TicketUpdatedEvent{
    subject: SubjectsEnum.TicketUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    };
}