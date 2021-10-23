import { SubjectsEnum, PublisherAbstract, TicketUpdatedEvent } from "@chantickets/common";

export class TicketUpdatedPublisher extends PublisherAbstract<TicketUpdatedEvent> {
    readonly subject = SubjectsEnum.TicketUpdated;
    
}