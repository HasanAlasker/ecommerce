import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Better to reference User model
    ref: 'users', // If you have a User model
    required: true,
    index: true // For faster queries
  },
  
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products', // Reference to your Product model
      required: true
    },
    name: {
      type: String,
      required: true // Store product name for faster access
    },
    image: {
      type: String // Store product image URL
    },
    price: {
      type: Number,
      required: true,
      min: 0 // Price can't be negative
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // At least 1 item
      default: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0 // Calculated as price * quantity
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
    min: 0 // Total quantity of all items
  },
  
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
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
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Index for better performance
cartSchema.index({ userId: 1, status: 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  // Calculate total amount and total items
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.updatedAt = new Date();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productData) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId.toString() === productData.productId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += productData.quantity || 1;
    this.items[existingItemIndex].subtotal = 
      this.items[existingItemIndex].price * this.items[existingItemIndex].quantity;
  } else {
    // Add new item
    const subtotal = productData.price * (productData.quantity || 1);
    this.items.push({
      ...productData,
      quantity: productData.quantity || 1,
      subtotal
    });
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.productId.toString() === productId.toString()
  );
  
  if (item) {
    item.quantity = quantity;
    item.subtotal = item.price * quantity;
  }
  
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

const cartModel = mongoose.model("cart", cartSchema); 
export default cartModel;