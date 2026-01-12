import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const generateVideoThumbnail = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { start_offset: "2" },
      { width: 400, height: 225, crop: "fill" },
    ],
  });
};
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Number(limit), 10);
  const skip = (pageNumber - 1) * limitNumber;
  const filter = {
    isPublished: true,
  };
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }
  if (!description?.trim()) {
    throw new ApiError(400, "Title is required");
  }
  const videoLocalPath = req.files?.video?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  const videoCloudinary = await uploadOnCloudinary(videoLocalPath);
  if (!videoCloudinary) {
    throw new ApiError(500, "Video unable to upload");
  }
  const thumbnail = generateVideoThumbnail(videoCloudinary.public_id);
  const video = await Video.create({
    title,
    description,
    videoFile: videoCloudinary.url,
    thumbnail: thumbnail,
    duration: videoCloudinary.duration,
    owner: req.user._id,
    isPublished: true,
    views: 0,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video Uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).select("-isPublished");
  if (!video) {
    throw new ApiError(400, "Video Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  if (![title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All details are required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "No video found");
  }
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "Not authorised to update the video");
  }

  video.title = title;
  video.description = description;
  if (req.file?.path) {
    const uploadedThumb = await uploadOnCloudinary(req.file.path);
    video.thumbnail = uploadedThumb.url;
  }
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unnauthorised to delete the video");
  }
  if (video.videoFile?.public_id) {
    await cloudinary.uploader.destroy(video.videoFile.publicId);
  }
  await Video.deleteOne({ _id: videoId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unnauthorised to delete the video");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status changed successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
