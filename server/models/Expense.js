const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
    amount: {
      type: Number,
      required: [true, "Lütfen harcama miktarını giriniz."],
    },
    category: {
      type: String,
      required: [true, "Lütfen bir kategori belirtiniz."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Expense", expenseSchema);