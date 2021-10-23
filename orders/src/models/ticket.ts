import mongoose from 'mongoose';
import { Order } from './orders';
import { OrdersStatus } from '@chantickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { idText } from 'typescript';

interface TicketAttrs{
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string,version: number}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) =>{
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

ticketSchema.statics.findByEvent = (event: { id: string, version: number}) =>{
    return Ticket.findOne({
        _id: event.id,
        version: event.version-1
    });
};

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrdersStatus.Created,
                OrdersStatus.AwaitingPayment,
                OrdersStatus.Complete,
            ],
        },
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };