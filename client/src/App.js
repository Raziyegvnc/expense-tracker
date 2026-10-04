import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Yiyecek/İçecek");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [date, setDate] = useState("Tümü");
  const [loading, setLoading] = useState("true");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/expenses");
        if (!response.ok){
          setError("Veriler Alınamadı.");
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setExpenses(data);
        setLoading(false);
        
      } catch (error) {
        setError("Veriler çekilirken hata oluştu:", error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault(); 

    if (!amount || !description) return alert("Lütfen alanları doldurun!");

    const newExpenseData = {
      description: description,
      amount: Number(amount),
      category: category
    };

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExpenseData)
      });

      if (response.ok) {
        const savedExpense = await response.json();

        setExpenses([...expenses, savedExpense]);

        setAmount("");
        setDescription("");

        setCategory("Yiyecek/İçecek");
      }
    } catch (error) {
      console.error("Harcama eklenirken hata oluştu:", error);
    }
  };

const handleDelete= async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {method: "DELETE"});

    if (response.ok) {
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      setExpenses(updatedExpenses);
      }
  } catch (error) {
    console.error("Silme işlemi sırasında hata oluştu:", error);
  }
  
};

const filteredExpenses = selectedCategory === "Tümü"
  ? expenses
  : expenses.filter((expense) => expense.category === selectedCategory);


const filtered2Expenses = filteredExpenses.filter((expense) =>{
  if (date === "Tümü")
    return true;
  const today = new Date();
  const expenseDate = new Date(expense.createdAt || expense.date);
  if(date==="Bugün"){
    return(
      expenseDate.getDate() === today.getDate()&&
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  }

  if(date === "Bu Ay"){
    return(
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  }
  return true;
});

const totalAmount = filtered2Expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

if(loading){
    return <div>Harcamalar yükleniyor, lütfen bekleyin...</div>;
  };
if (error){
   return <div style={{ color: "red" }}>{error}</div>;
   };

return(
  <div className="container">
    <form onSubmit={handleAddExpense}>
      <input 
        value={amount} 
        type="number" 
        placeholder="Miktar"
        onChange={(e) => setAmount(e.target.value)}
      />
      <input 
        value={description} 
        type="text" 
        placeholder="Açıklama"
        onChange={(e) => setDescription(e.target.value)} 
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Yiyecek/İçecek">Yiyecek/İçecek</option>
        <option value="Ulaşım">Ulaşım</option>
        <option value="Eğlence">Eğlence</option>
        <option value="Diğer">Diğer</option>
      </select>
      <button type="submit">Ekle</button>
    </form>

    <hr />
    <div className="filter-container">
      <label><strong>Kategoriye Göre Filtrele: </strong></label>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="Tümü">Tümü</option>
        <option value="Yiyecek/İçecek">Yiyecek/İçecek</option>
        <option value="Ulaşım">Ulaşım</option>
        <option value="Eğlence">Eğlence</option>
        <option value="Diğer">Diğer</option>
      </select>

      <label><strong>Tarihe Göre Filtrele: </strong></label>
      <select value={date} onChange={(e) => setDate(e.target.value)}>
        <option value="Tümü">Tümü</option>
        <option value="Bugün">Bugün</option>
        <option value="Bu Ay">Bu Ay</option>

      </select>
    </div>

    <div>
      <h3>
        {selectedCategory === "Tümü" ? "Tüm Harcamalar" : `${selectedCategory} Harcamaları`}
      </h3>
      
      {filtered2Expenses.length === 0 ? (
      <p>Henüz kayıtlı bir harcama yok veya seçtiğiniz filtrelere uygun harcama bulunamadı.</p>
      ) : (
     <ul>
      {filtered2Expenses.map((expense) => (
      <li key={expense._id}>
        <strong>{expense.title || expense.description}</strong> - {expense.amount} TL [{expense.category}]
        <button className="delete-btn" onClick={() => handleDelete(expense._id)}>Sil</button>
      </li>
          ))}
      </ul>
)}
    </div>

    <div>
      <h2>
        {selectedCategory === "Tümü" ? "Toplam Harcama" : `${selectedCategory} Toplamı`}: {totalAmount} TL
      </h2>
    </div>
  </div>
);
}

export default App;