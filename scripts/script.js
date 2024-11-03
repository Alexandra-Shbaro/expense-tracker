const form = document.getElementById("form");
const transactionsContainer = document.getElementById("transactions");
const totalBudget = document.getElementById("total-budget");

// Function to get the total budget
function getTotalBudget(transactions) {

    let total = 0;

    // Looping over the transactions to calculate the total budget
    transactions.map((transaction) => {
        const { type, amount } = transaction
        if (type === "income") {
            total += amount
        } else {
            total -= amount
        }
    })

    return total
}


// Function to load all transactions
function loadTransactions() {

    // Fetching the transactions
    const transactions = getTransactions()

    // Initializing the content to empty
    let content = ``

    // Dynamically adding transaction items
    transactions.map((transaction) => {

        const { id, date, notes, type, amount } = transaction

        content += `
        <div class="transaction-item ${type}">
          <span>${date}</span>
          <span>${notes}</span>
          <span>${type === "income" ? "+" : "-"}$${amount}</span>
          <button onclick="deleteTransaction(${id})">Delete</button>
        </div>
        `
    })

    // Fetching the budget
    const budget = getTotalBudget(transactions)

    // Setting the items + the budget
    transactionsContainer.innerHTML = content;
    totalBudget.textContent = `$${budget}`;

}


// Function to fetch transactions from local storage
function getTransactions() {

    // If no transactions are found (first visit to the page) , initialize with empty array
    const default_transactions = localStorage.getItem("transactions") || "[]"

    const transactions = JSON.parse(default_transactions);
    return transactions;
}

// Function to save transactions to Local Storage
function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    loadTransactions()
}

// Function to delete a transaction
function deleteTransaction(id) {
    let transactions = getTransactions()
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions(transactions);
}

// Function to handle form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let transactions = getTransactions()

    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value;

    const transaction = {
        id: Date.now(),
        amount,
        type,
        date,
        notes
    };

    transactions.push(transaction);
    saveTransactions(transactions);
    form.reset();
});

loadTransactions()