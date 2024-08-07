import Event from "../model/events.model.js";
import User from "../model/user.model.js";

export const createEvent = async (req, res, next) => {
  try {
    // Assuming req.user._id contains the ObjectId of the logged-in user
    console.log("Request User:", req.user); // Debugging line

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      location: req.body.location,
      imageUrls: req.body.imageUrls,
      category: req.body.category,
      organizer: userId,
    });

    // Save the new event
    let savedEvent = await newEvent.save();

    // Update the user's eventsOrganized list
    await User.findByIdAndUpdate(
      userId,
      { $push: { eventsOrganized: savedEvent._id } },
      { new: true } // Return the updated document
    );

    console.log("Organizer ID:", userId);
    console.log(savedEvent);
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
