import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

const image = mongoose.model("Image", imageSchema);

export default image;