import { PublisherAbstract } from "./base-publisher";
import { TickerCreatedEvent } from "./TicketCreatedEvent";
import { SubjectsEnum } from "./subjects";

export class TicketCreatedPublisher extends PublisherAbstract<TickerCreatedEvent>{
    readonly subject = SubjectsEnum.TicketCreated;
}