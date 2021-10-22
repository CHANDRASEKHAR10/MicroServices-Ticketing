import { Message } from 'node-nats-streaming';
import { SubjectsEnum, ListenerAbstract, TicketCreatedEvent } from '@chantickets/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends ListenerAbstract<TicketCreatedEvent> {
    readonly subject = SubjectsEnum.TicketCreated;
    queueGroupName = 'orders-service';

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        const { id,title ,price } = data;
        const ticket = Ticket.build({
            id,title,price
        });

        await ticket.save();

        msg.ack();
    }
}