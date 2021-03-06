import { OrderCreatedEvent, OrderStatus } from "@kmtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../NatsWrapper";
import { OrderCreatedListener } from "../orderCreatedListener";

const setup = async (): Promise<{
  listener: OrderCreatedListener;
  ticket: TicketDoc;
  data: OrderCreatedEvent["data"];
  message: Message;
}> => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "ljlkfdf"
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    expiresAt: "kldjlfd",
    userId: "ljfdlkjfd",
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };
  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };
  return { listener, ticket, data, message };
};

it("should set the order id on the ticket", async (): Promise<void> => {
  const { listener, ticket, data, message } = await setup();
  await listener.onMessage(data, message);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("should ack the message", async (): Promise<void> => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it("should publish a ticket updated event", async (): Promise<void> => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
