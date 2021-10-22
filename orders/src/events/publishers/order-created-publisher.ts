import { PublisherAbstract, SubjectsEnum, OrderCreatedEvent } from "@chantickets/common";

export class OrderCreatedPublisher extends PublisherAbstract<OrderCreatedEvent> {
    readonly subject = SubjectsEnum.OrderCreated;
}