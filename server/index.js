const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const mongoURI = process.env.MONGO_URI;

const expenseRoutes = require("./routes/expenseRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

async function connectDB(){
    try {
        await mongoose.connect(mongoURI);
        console.log("Bağlantı kuruldu...");
        
    } catch (error) {
        console.error("Bağlantı hatası:", error.message);
    }
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});