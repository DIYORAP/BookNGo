import Event from '../model/events.model.js';
import Order from '../model/orders.model.js';
import User from '../model/user.model.js';
import mongoose from 'mongoose';

export const bookig = async (req, res) => {
    const { tickets } = req.body;
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("User not logged in");
    }

    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(404).send('Event not found');
        }

        if (tickets > event.capacity - event.sold) {
            return res.status(400).json({ message: "Not enough tickets available" });
        }

        const totalPrice = event.ticketprice * tickets;

        // Create new order
        const order = new Order({
            user: userId,
            event: eventId,
            tickets,
            totalPrice,
            status: "pending",
        });
        
        await order.save();

        // Update event with new order ID in attendees
        event.sold += tickets;
        event.attendees.push(userId);

        await event.save();

        // Update user with new order ID in eventsAttended
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.eventsAttended.push(eventId);
        await user.save();

        res.status(201).send(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
