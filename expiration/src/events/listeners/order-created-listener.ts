import { ListenerAbstract, OrderCreatedEvent, SubjectsEnum } from "@chantickets/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends ListenerAbstract<OrderCreatedEvent> {
    readonly subject = SubjectsEnum.OrderCreated;
    queueGroupName = 'expiration-service';

    async onMessage(data: OrderCreatedEvent['data'],msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting for this many milliseconds',delay);

        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        });

        msg.ack();
    }
}