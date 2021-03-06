import { SubjectsEnum } from "./subjects";

export interface TickerCreatedEvent{
    subject: SubjectsEnum.TicketCreated;
    data:{
        id: string;
        title: string;
        price: number;
    };
} 