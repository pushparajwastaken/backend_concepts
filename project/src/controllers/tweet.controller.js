import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() == "") {
      throw new ApiError(404, "Content missing");
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(401, "Invalid User");
    }
    const tweet = await Tweet.create({
      content: content.trim(),
      owner: user._id,
    });
    const createdTweet = await Tweet.findById(tweet._id);
    if (!createdTweet) {
      throw new ApiError(500, "Something went wrong");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { tweet }, "Tweet Created Successfully"));
  } catch (error) {
    console.log(error?.message || "Somethig went wrong while creating tweet");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
  if (!tweets?.length) {
    throw new ApiError(404, "No Tweets exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;
  if (!content || content.trim() == "") {
    throw new ApiError(404, "Content is required");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet Not Found");
  }
  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "Not allowed to update this tweet");
  }
  tweet.content = content.trim();
  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated Succesfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet doesn't exist");
  }
  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "Not Authorised to delete the tweet");
  }
  await Tweet.deleteOne({ _id: tweetId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
