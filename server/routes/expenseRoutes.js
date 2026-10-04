const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.post("/", async(req, res) => {
    try {
        const newExpense = await Expense.create(req.body);
        res.status(201).json(newExpense);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/", async(req,res) => {
    try {
        const expenseFind = await Expense.find();
        res.status(200).json(expenseFind);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async(req,res) =>{
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if(!deletedExpense){
            return res.status(404).json({ message: "Silinmek istenen harcama bulunamadı." });
        }else{
            return res.status(200).json({ message: "Harcama başarıyla silindi." });
         }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;