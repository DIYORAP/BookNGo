import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  starttime: {
    type: String,
    required: true,
  },
  endtime: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ticketprice:{
    type:Number,
    required:true,
  }, 
  capacity:{
    type:Number,
    required:true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
