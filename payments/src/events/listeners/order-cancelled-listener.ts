import { ListenerAbstract, NotFoundError, OrderCancelledEvent, OrdersStatus, SubjectsEnum } from "@chantickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCancelledistener extends ListenerAbstract<OrderCancelledEvent> {
    readonly subject = SubjectsEnum.OrderCancelled;
    queueGroupName = 'payments-service';

    async onMessage(data: OrderCancelledEvent['data'],msg: Message){
        const order = await Order.findOne({
            _id: data.id,
            version: data.version-1
        });

        if(!order){
            throw new NotFoundError();
        }

        order.set({status: OrdersStatus.Cancelled});
        await order.save();

        msg.ack();
    }
}