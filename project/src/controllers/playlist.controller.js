import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Name and Description are required");
  }
  const playlist = await Playlist.create({
    videos: [],
    owner: userId,
    name: name,
    description: description,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const playlists = await Playlist.find({ owner: userId }).sort({
    createdAt: -1,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Not a valid playlist id");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist successfully fetched by Id")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist or Video Id");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not allowed to modify this playlist");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(409, "Video already exists in playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Playlist or Video Id");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or not authorized");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist");
  }
  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or not authorised");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid Playlist");
  }
  if (!name?.trim() && !description?.trim()) {
    throw new ApiError(400, "Name and Description are required");
  }
  const updateFields = {};
  if (name?.trim()) updateFields.name = name.trim();
  if (description?.trim()) updateFields.description = description.trim();

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $set: updateFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
