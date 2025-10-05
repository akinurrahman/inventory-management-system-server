import mongoose from "mongoose";


export interface IOrder extends mongoose.Document {
  userId?: mongoose.Types.ObjectId;
  customerInfo: {
    name?: string;
    phone?: string;
  };
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  status: "pending" | "shipped" | "delivered" | "canceled";
  totalPrice: number;
  orderId: string;
};

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }, // price per item after discount
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerInfo: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true, min: 0 },
    orderId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  if (!this.totalPrice) {
    const Product = mongoose.model("Product");
    let total = 0;

    for (const item of this.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const discount = (product.price * product.discount) / 100;
        const finalPrice = product.price - discount;
        item.price = finalPrice;
        total += finalPrice * item.quantity;
      }
    }

    this.totalPrice = total;
  }

  next();
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
