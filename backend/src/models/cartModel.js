import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true
  },
  
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountedPrice: {
      type: Number,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  totalItems: {
    type: Number,
    default: 0,
    min: 0
  },
  
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired', 'completed'],
    default: 'active'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better performance
cartSchema.index({ userId: 1, status: 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  // Calculate total amount using discounted price if available
  this.totalAmount = this.items.reduce((total, item) => {
    const effectivePrice = item.discountedPrice || item.price;
    return total + (effectivePrice * item.quantity);
  }, 0);
  
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.updatedAt = new Date();
  next();
});

// Your other methods can go here...

const cartModel = mongoose.model("cart", cartSchema); 
export default cartModel;