import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }
  const existingLikeStatus = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });
  if (existingLikeStatus) {
    await existingLikeStatus.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Video Unliked"));
  }
  const like = await Like.create({
    video: videoId,
    likedBy: userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { like }, "Video Liked Successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment");
  }
  const commentExists = await Comment.findById(commentId);
  if (!commentExists) {
    throw new ApiError(404, "Comment not found");
  }
  const existingLikeStatus = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (existingLikeStatus) {
    await existingLikeStatus.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Removed like from comment"));
  }
  const like = await Like.create({
    comment: commentId,
    likedBy: userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { like }, "Comment liked Successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet Id invalid");
  }
  const tweetExists = await Tweet.findById(tweetId);
  if (!tweetExists) {
    throw new ApiError(404, "Tweet doesn't exist");
  }
  const existingLikeStatus = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (existingLikeStatus) {
    await existingLikeStatus.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Removed like from tweet"));
  }
  const like = await Like.create({
    tweet: tweetId,
    likedBy: userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { like }, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        _id: 0,
        video: 1,
        likedAt: "$createdAt",
      },
    },
  ]);
  if (likedVideos.length === 0) {
    throw new ApiError(400, "No videos liked by the user");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos,
        "Videos liked by User fetched Successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
