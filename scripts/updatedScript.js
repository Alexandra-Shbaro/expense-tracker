document.addEventListener("DOMContentLoaded", (event) => {
    // Check if user is in local storage
    let local_user = localStorage.getItem("user_id");
    if (!local_user) {
        window.location.href = "/expense-tracker/login.html";
    }

    // Fetching containers
    const form = document.getElementById("form");
    const transactionsContainer = document.getElementById("transactions");
    const totalBudget = document.getElementById("total-budget");

    // Defining Filters
    var keyword = "";
    var date = null;
    var min_amount = null;
    var max_amount = null;
    var trans_type = "all";

    // Defining listeners for filters
    document.getElementById("keyword-filter").addEventListener("input", function (event) {
        keyword = event.target.value;
    });

    document.getElementById("date-filter").addEventListener("change", function (event) {
        date = event.target.value;
    });

    document.getElementById("min-filter").addEventListener("input", function (event) {
        min_amount = event.target.value ? parseFloat(event.target.value) : null;
    });

    document.getElementById("max-filter").addEventListener("input", function (event) {
        max_amount = event.target.value ? parseFloat(event.target.value) : null;
    });

    document.getElementById("type-filter").addEventListener("change", function (event) {
        trans_type = event.target.value;
    });

    document.getElementById("filter-btn").addEventListener("click", function (event) {
        loadTransactions();
    });

    function filterItems(transactions) {
        if (min_amount && max_amount && min_amount > max_amount) {
            document.getElementById("filter-error").textContent = "Min Amount should be less than Max Amount.";
            return transactions; // Return unfiltered list if error
        } else {
            document.getElementById("filter-error").textContent = "";
        }

        return transactions.filter(transaction => {
            if (keyword && !(transaction.notes).toLowerCase().includes(keyword)) return false;
            if (date && transaction.date !== date) return false;
            if (min_amount && transaction.amount < min_amount) return false;
            if (max_amount && transaction.amount > max_amount) return false;
            if (trans_type && trans_type !== "all" && transaction.type !== trans_type) return false;
            return true;
        });
    }

    function getTotalBudget(transactions) {
        return transactions.reduce((total, { type, amount }) => type === "income" ? total + amount : total - amount, 0);
    }

    function loadTransactions() {
        const transactions = filterItems(getTransactions());
        console.log("Loaded Transactions:", transactions);

        let content = "";
        if (transactions.length === 0) {
            content = '<p class="no-transactions">No transactions found</p>';
        } else {
            transactions.forEach(transaction => {
                const { transaction_id, date, notes, type, amount } = transaction;
                content += `
                <div class="transaction-item ${type}">
                  <span>${date}</span>
                  <span>${type === "income" ? "+" : "-"}$${amount}</span>
                  <span>${notes}</span>
                  <button onclick="deleteTransaction(${transaction_id})" class="delete-btn">Delete</button>
                </div>`;
            });
        }

        transactionsContainer.innerHTML = content;
        totalBudget.textContent = `$${getTotalBudget(transactions)}`;
    }

    function getTransactions() {
        const default_transactions = localStorage.getItem("transactions") || "[]";
        return JSON.parse(default_transactions);
    }

    function saveTransactions(transactions) {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        loadTransactions();
    }

    function deleteTransaction(id) {
        let transactions = getTransactions().filter(transaction => transaction.transaction_id !== id);
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

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById("amount").value);
        if (amount <= 0) {
            toggleErrorVisibility(true);
            return;
        } else {
            toggleErrorVisibility(false);
        }

        const type = document.getElementById("type").value;
        const date = document.getElementById("date").value;
        const notes = document.getElementById("notes").value;

        const transaction = {
            transaction_id: Date.now(), // Create a unique ID
            user_id: get_user_id(),
            amount,
            type,
            date: formatDate(date),
            notes
        };

        const encodedTransaction = Object.entries(transaction)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        try {
            const response = await fetch("/expense-tracker/api/createTransaction.php", {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodedTransaction,
            });

            const res = await response.json();
            if (res.success) {
                alert("Transaction added successfully!");
                
                // Update local storage manually
                const transactions = getTransactions();
                transactions.push(transaction);
                saveTransactions(transactions);
            } else {
                alert("Failed to add transaction.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        }

        form.reset();
    });

    function get_user_id() {
        return localStorage.getItem("user_id");
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    loadTransactions(); // Initial load when page is ready
});
