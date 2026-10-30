// State Aplikasi
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart = null;

// Elemen DOM
const form = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const totalBalanceEl = document.getElementById('totalBalance');
const transactionListEl = document.getElementById('transactionList');
const sortSelect = document.getElementById('sortSelect');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateUI();
});

// Event Handler: Tambah Transaksi
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (!name || isNaN(amount) || !category) {
        alert('Mohon isi semua field!');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        name,
        amount,
        category
    };

    transactions.push(newTransaction);
    saveData();
    updateUI();

    // Reset Form
    form.reset();
});

// Simpan Data ke LocalStorage
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Hapus Transaksi
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateUI();
}

// Render Transaksi & Update Total
function updateUI() {
    // 1. Hitung Total Balance
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    totalBalanceEl.textContent = `$${total.toFixed(2)}`;

    // 2. Sorting Transaksi (Optional Challenge)
    let sortedTransactions = [...transactions];
    if (sortSelect.value === 'amount-high') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
    } else if (sortSelect.value === 'amount-low') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    }

    // 3. Render List Transaksi
    transactionListEl.innerHTML = '';
    sortedTransactions.forEach(t => {
        const item = document.createElement('div');
        item.classList.add('transaction-item');
        
        // Optional Challenge: Highlight transaksi > $50
        if (t.amount > 50) {
            item.classList.add('high-spending');
        }

        item.innerHTML = `
            <div class="item-info">
                <div class="item-name">${t.name}</div>
                <div class="item-amount">$${t.amount.toFixed(2)}</div>
                <span class="badge badge-${t.category}">${t.category}</span>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
        `;
        transactionListEl.appendChild(item);
    });

    // 4. Update Chart
    updateChart();
}

// Inisialisasi Chart.js
function initChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#2ecc71', '#3498db', '#e67e22']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Update Data Chart
function updateChart() {
    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Fun: 0
    };

    transactions.forEach(t => {
        if (categoryTotals[t.category] !== undefined) {
            categoryTotals[t.category] += t.amount;
        }
    });

    myChart.data.datasets[0].data = [
        categoryTotals.Food,
        categoryTotals.Transport,
        categoryTotals.Fun
    ];
    myChart.update();
}

// Event Handler: Sort Filter Change
sortSelect.addEventListener('change', updateUI);

// Optional Challenge: Dark/Light Mode Toggle
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙 Dark Mode';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }
});