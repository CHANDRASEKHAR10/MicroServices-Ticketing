import { Message } from 'node-nats-streaming';
import { SubjectsEnum, ListenerAbstract, TicketUpdatedEvent } from '@chantickets/common';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends ListenerAbstract<TicketUpdatedEvent> {
    readonly subject = SubjectsEnum.TicketUpdated;
    queueGroupName = 'orders-service';

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const ticket = await Ticket.findByEvent(data);
        if(!ticket){
            throw new Error('Ticket not found');
        }

        const { title,price } = data;
        ticket.set({title,price});
        await ticket.save();

        msg.ack();
    }
}