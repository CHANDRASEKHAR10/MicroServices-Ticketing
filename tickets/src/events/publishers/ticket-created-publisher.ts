import { SubjectsEnum, PublisherAbstract, TicketCreatedEvent } from "@chantickets/common";

export class TicketCreatedPublisher extends PublisherAbstract<TicketCreatedEvent> {
    readonly subject = SubjectsEnum.TicketCreated;
    
}