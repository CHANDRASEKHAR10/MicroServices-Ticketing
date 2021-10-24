import { ExpirationCompleteEvent, ListenerAbstract, NotFoundError, SubjectsEnum, OrdersStatus } from "@chantickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends ListenerAbstract<ExpirationCompleteEvent> {
    readonly subject = SubjectsEnum.ExpirationComplete;
    queueGroupName = 'orders-service';

    async onMessage(data: ExpirationCompleteEvent['data'],msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order){
            throw new NotFoundError();
        }

        order.set({
            status: OrdersStatus.Cancelled
        });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}