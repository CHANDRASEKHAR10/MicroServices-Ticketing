import { SubjectsEnum, PublisherAbstract, TickerCreatedEvent } from "@chantickets/common";

export class TicketCreatedPublisher extends PublisherAbstract<TickerCreatedEvent> {
    readonly subject = SubjectsEnum.TicketCreated;
    
}