import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;
  if (isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Chanel Id");
  }
  if (subscriberId.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }
  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });
  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Channel Unsubscribed"));
  }
  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { subscription }, "Channel Subscribed Successfully")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId?.trim()) {
    throw new ApiError(400, "Channel Id is missing");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localfield: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        _id: 0,
        subscriber: "$subscriberDetails",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: subscribers.length,
        subscribers,
      },
      "Channel subscribers fetched successfully"
    )
  );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId?.trim()) {
    throw new ApiError(400, "Subscriber Id is missing");
  }
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $project: {
        _id: 0,
        channel: "$channelDetails",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: subscribedChannels.length,
        subscribedChannels,
      },
      "Subscribed channels fetched successfully"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
