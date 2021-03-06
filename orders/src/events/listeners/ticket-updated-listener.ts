import { Listener, Subjects, TicketUpdatedEvent } from "@kmtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  protected subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  protected queueGroupName: string = queueGroupName;
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.title = data.title;
    ticket.price = data.price;
    await ticket.save();
    msg.ack();
  }
}
