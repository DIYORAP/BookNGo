import Event from "../model/events.model.js";

export const createEvent = async (req, res, next) => {
  try {
    // Assuming req.user._id contains the ObjectId of the logged-in user
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      location: req.body.location,
      imageUrls: req.body.imageUrls,
      category: req.body.category,
      organizer: req.user._id, // This should be the ObjectId of the user who is organizing the event
    });
    console.log("Organizer ID:", req.user._id);
    let savedEvent = await newEvent.save();
    console.log(savedEvent);
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
