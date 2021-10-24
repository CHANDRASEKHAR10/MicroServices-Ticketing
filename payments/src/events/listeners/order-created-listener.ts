import { ListenerAbstract, OrderCreatedEvent, SubjectsEnum } from "@chantickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEvent> {
    readonly subject = SubjectsEnum.OrderCreated;
    queueGroupName = 'payments-service';

    async onMessage(data: OrderCreatedEvent['data'],msg: Message){

        console.log('Payments-OrderCreatedListener-data is ',data.id ,data.ticket.price ,data.status);
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
            userId: data.userId
        });

        console.log('Order properties in payment are ',order.id,order.price,order.status);

        await order.save();

        msg.ack();
    }
}