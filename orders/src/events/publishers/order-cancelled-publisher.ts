import { PublisherAbstract, SubjectsEnum, OrderCancelledEvent } from "@chantickets/common";

export class OrderCancelledPublisher extends PublisherAbstract<OrderCancelledEvent> {
    readonly subject = SubjectsEnum.OrderCancelled;
}