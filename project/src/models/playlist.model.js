import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Playlist = new mongoose.model("Playlist", playlistSchema);
