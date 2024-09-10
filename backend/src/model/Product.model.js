import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ["tshirt", "shirt", "pant", "bottom", "jacket", "coorder"], 
    trim: true
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, 'A product must have exactly 5 images'] 
  },
  sizeOptions: [{
    size: {
      type: String,
      enum: [
        "XS", "S", "M", "L", "XL", "XXL", "XXXL", 
        "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", 
        "4T", "5T", "6T", "7T", "8T", "10T", "12T"
      ],
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      originalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      discountedPrice: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: function(value) {
            return value <= this.price.originalPrice;
          },
          message: "Discounted price should not be higher than the original price"
        }
      }
    },
    gender: {
      type: String,
      enum: ["male", "female", "child", "unisex"],
      required: true
    },
    color: {
      type: String,
      enum: [
        "blue", "red", "yellow", "green", "black", "white", "gray", 
        "orange", "pink", "purple", "brown", "navy", "beige", "maroon"
      ],
      required: true
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5  
  },
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length === 5;
}

export const Product = mongoose.model("Product", productSchema);