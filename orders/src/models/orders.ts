import mongoose from 'mongoose';
import { OrdersStatus } from '@chantickets/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrdersAttrs{
    userId: string;
    status: OrdersStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrdersDoc extends mongoose.Document{
    userId: string;
    status: OrdersStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

interface OrdersModel extends mongoose.Model<OrdersDoc>{
    build(attrs: OrdersAttrs): OrdersDoc;
}

const ordersSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrdersStatus),
        default: OrdersStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

ordersSchema.set('versionKey','version');
ordersSchema.plugin(updateIfCurrentPlugin);

ordersSchema.statics.build = (attrs: OrdersAttrs) =>{
    return new Order(attrs);
};

const Order = mongoose.model<OrdersDoc,OrdersModel>('Order', ordersSchema);

export { Order };