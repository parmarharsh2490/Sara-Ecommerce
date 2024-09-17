import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { uploadImage } from "../utils/Cloudinary.js";
import { ProductReview } from "../model/ProductReview.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProductReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    throw new ApiError(400, "ProductId is not valid");
  }
  const { ratingStar, reviewTitle, reviewDescription } = req.body;
  const file = req.file;

  if (!ratingStar || !reviewTitle || !reviewDescription) {
    throw new ApiError(400, "Input fields cannot be empty");
  }

  if (isNaN(ratingStar) || ratingStar < 1 || ratingStar > 5) {
    throw new ApiError(400, "Rating star must be a number between 1 and 5");
  }

  if (!file) {
    throw new ApiError(400, "Review image not found");
  }

  const existingProductReview = await ProductReview.findOne({
    user: user._id,
    product: productId,
  });

  if (existingProductReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const image = await uploadImage(file.path);
  if (!image || !image.secure_url) {
    throw new ApiError(500, "Failed to upload image");
  }

  const review = await ProductReview.create({
    user: user._id,
    ratingStar: Number(ratingStar),
    reviewImage: {
      imageUrl: image.secure_url,
      publicId: image.public_id,
    },
    reviewTitle,
    reviewDescription,
    product: productId,
  })

  if (!review) {
    throw new ApiError(500, "Failed to create review");
  }
  if (review.reviewImage) {
    delete review.reviewImage.publicId;
  }
  
  return res.status(201).json(new ApiResponse(201, review, "Review created successfully"));
});

const updateProductReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    throw new ApiError(400, "ProductId is not valid");
  }
  const { ratingStar, reviewTitle, reviewDescription } = req.body;

  if (!ratingStar || !reviewTitle || !reviewDescription) {
    throw new ApiError(400, "Input fields cannot be empty");
  }

  if (isNaN(ratingStar) || ratingStar < 1 || ratingStar > 5) {
    throw new ApiError(400, "Rating star must be a number between 1 and 5");
  }

  const existingProductReview = await ProductReview.findOne({
    user: user._id,
    product: productId,
  }).select('-createdAt -updatedAt');
  if (!existingProductReview) {
    throw new ApiError(404, "Product Review not found");
  }

  const file = req.file;
  if (file) {
    let image = await uploadImage(file.path);
    // have to improve delete image functionality here
    existingProductReview.reviewImage = {
      imageUrl: image.url,
      publicId: image.public_id,
    };
  }
  existingProductReview.ratingStar = ratingStar;
  existingProductReview.reviewTitle = reviewTitle;
  existingProductReview.reviewDescription = reviewDescription;
  await existingProductReview.save({ validationBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        existingProductReview,
        "Successfully updated product review"
      )
    );
});

const deleteProductReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productReviewId } = req.params;

  if (!productReviewId || !isValidObjectId(productReviewId)) {
    throw new ApiError(400, "Invalid ProductReview ID");
  }

  const productReview = await ProductReview.findById(productReviewId);
  if (!productReview) {
    throw new ApiError(404, "ProductReview not found");
  }

  if (!userId.equals(productReview.user)) {
    throw new ApiError(403, "Unauthorized to delete this ProductReview");
  }

  await ProductReview.findByIdAndDelete(productReviewId);
  return res
    .status(204)
    .json(new ApiResponse(204, null, "ProductReview successfully deleted"));
});

const getAverageProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const averageRating = await ProductReview.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId)
      }
    },
    {
      $group: {
        _id: "$ratingStar", // Group by rating star value
        count: { $sum: 1 }  // Count how many times each rating star is given
      }
    },
    {
      $group: {
        _id: null,
        totalUserCount: { $sum: "$count" }, // Total number of users
        weightedSum: { $sum: { $multiply: ["$_id", "$count"] } }, // Sum of ratings weighted by count
        ratingData: { 
          $push: { 
            rating: "$_id",
            count: "$count"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUserCount: 1,
        averageRating: {
          $round: [{ $divide: ["$weightedSum", "$totalUserCount"] }, 2] // Round average rating to 2 decimal places
        },
        ratingData: {
          $map: {
            input: "$ratingData",
            as: "rd",
            in: {
              rating: "$$rd.rating",
              count: "$$rd.count",
              percentage: { 
                $round: [
                  { $multiply: [{ $divide: ["$$rd.count", "$totalUserCount"] }, 100] }, 
                  2
                ] // Round percentage to 2 decimal places
              }
            }
          }
        }
      }
    }
])
  // const averageRating = await ProductReview.aggregate([
  //   {
  //     $match: { product: new mongoose.Types.ObjectId(productId) },
  //   },
  //   {
  //     $group: {
  //       _id: "$product", // Group by product ID
  //       ratingAverage: { $avg: "$ratingStar" }, // Calculate the average of the ratingStar field
  //     },
  //   },
  // ]);

  // if (averageRating.length === 0) {
  //   return res
  //     .status(404)
  //     .json(new ApiResponse(404, null, "No ratings found for this product"));
  // }
  // return res.status(200).json(new ApiResponse(200, averageRating[0], "Average rating retrieved successfully"));
  return res.status(200).json(new ApiResponse(200, averageRating, "Average rating retrieved successfully"));
});

export {
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getAverageProductReview,
};
