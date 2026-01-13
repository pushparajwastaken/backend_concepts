import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(1, Math.min(Number(limit), 10));
  const skip = (pageNumber - 1) * limitNumber;
  const sortOptions = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video doesn't exist");
  }
  const filter = { video: videoId };
  const comments = await Comment.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("owner", "userName avatar")
    .lean();
  const totalComments = await Comment.countDocuments(filter);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        pagination: {
          totalComments,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalComments / limitNumber),
          hasNextPage: skip + comments.length < totalComments,
        },
      },
      "Comments fetched Successfully"
    )
  );
});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is rrequried");
  }
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }
  const comment = await Comment.create({
    video: videoId,
    owner: userId,
    content: content.trim(),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { comment }, "Comment added successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Coment id");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is rrequried");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!comment.owner.equals(userId)) {
    throw new ApiError(403, "Unauthorised to edit the comment");
  }
  comment.content = content.trim();
  await comment.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { comment }, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid coment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!comment.owner.equals(userId)) {
    throw new ApiError(403, "Unauthorised to delete the comment");
  }
  await comment.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
