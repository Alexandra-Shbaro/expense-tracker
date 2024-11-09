// Fetching containers
const form = document.getElementById("form");
const transactionsContainer = document.getElementById("transactions");
const totalBudget = document.getElementById("total-budget");


// Defining Filters
var keyword = ""
var date = null
var min_amount = null
var max_amount = null
var trans_type = "all"


// Defining listeners for filters

// Keyword filter
document.getElementById("keyword-filter").addEventListener("input", function (event) {
    keyword = event.target.value;
});

// Date filter
document.getElementById("date-filter").addEventListener("change", function (event) {
    date = event.target.value;
});

// Min amount filter
document.getElementById("min-filter").addEventListener("input", function (event) {
    min_amount = event.target.value ? parseFloat(event.target.value) : null;
});

// Max amount filter
document.getElementById("max-filter").addEventListener("input", function (event) {
    max_amount = event.target.value ? parseFloat(event.target.value) : null;
});

// Transaction type filter
document.getElementById("type-filter").addEventListener("change", function (event) {
    trans_type = event.target.value;
});


// Filter button listener
document.getElementById("filter-btn").addEventListener("click", function (event) {
    loadTransactions()
});


// Function to filter items
function filterItems(transactions) {

    // Check if both min_amount and max_amount are set, and validate their relationship
    if (min_amount && max_amount) {
        if (min_amount > max_amount) {
            document.getElementById("filter-error").textContent = "Min Amount should be less than Max Amount.";
            return;
        } else {
            document.getElementById("filter-error").textContent = ""; // Clear any previous error message
        }
    } else {
        // Clear error if only one of them is set or both are null
        document.getElementById("filter-error").textContent = "";
    }

    // Filter transactions based on active filters
    const filteredTransactions = transactions.filter(transaction => {

        if (keyword && !(transaction.notes).toLowerCase().includes(keyword)) {
            return false;
        }

        if (date && transaction.date !== date) {
            return false;
        }
        if (min_amount && transaction.amount < min_amount) {
            return false;
        }

        if (max_amount && transaction.amount > max_amount) {
            return false;
        }

        if (trans_type && trans_type !== "all" && transaction.type !== trans_type) {
            return false;
        }

        return true;
    });

    return filteredTransactions;
}

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
    const transactions = filterItems(getTransactions())

    // Initializing the content to empty
    let content = ``

    // Check if there are no transactions
    if (transactions.length === 0) {
        content = <p class="no-transactions">No transactions found</p>;
    } else {
        // Dynamically adding transaction items
        transactions.map((transaction) => {

            const { id, date, notes, type, amount } = transaction

            content += `
            <div class="transaction-item ${type}">
              <span>${date}</span>
              <span>${type === "income" ? "+" : "-"}$${amount}</span>
              <span>${notes}</span>
              <button onclick="deleteTransaction(${id})" class="delete-btn">Delete</button>
            </div>
            `
        })
    }

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

// Function to save transactions to local storage
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

function toggleErrorVisibility(state) {
    const error_container = document.getElementById("amount-error");
    if (state) {
        error_container.classList.remove("hidden");
    } else {
        error_container.classList.add("hidden");
    }
}

// Function to handle form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let transactions = getTransactions()

    const amount = parseFloat(document.getElementById("amount").value);

    // Checking if the amount is valid
    if (amount <= 0) {
        toggleErrorVisibility(true)
        return;
    } else {
        toggleErrorVisibility(false)
    }

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