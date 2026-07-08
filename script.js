// Smart Expense Analyzer - Personal Finance Intelligence System

class ExpenseAnalyzer {
    constructor() {
        this.expenses = [];
        this.categoryChart = null;
        this.monthlyChart = null;
        this.init();
    }

    init() {
        this.loadExpenses();
        this.setupEventListeners();
        this.setDefaultDate();
        this.addDummyData();
        this.updateDashboard();
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterExpenses();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterExpenses();
        });

        document.getElementById('monthFilter').addEventListener('change', (e) => {
            this.filterExpenses();
        });
    }

    // Set default date to today
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    // Add dummy data for testing
    addDummyData() {
        // Always load dummy data for demonstration (PKR amounts)
        const dummyExpenses = [
            { id: 1, amount: 2500.00, description: "Pizza dinner", category: "Food", date: "2026-04-08", timestamp: "2026-04-08T19:00:00.000Z" },
            { id: 2, amount: 800.00, description: "Uber ride to work", category: "Transport", date: "2026-04-08", timestamp: "2026-04-08T08:30:00.000Z" },
            { id: 3, amount: 4500.00, description: "New running shoes", category: "Shopping", date: "2026-04-07", timestamp: "2026-04-07T15:20:00.000Z" },
            { id: 4, amount: 850.00, description: "Coffee and croissant", category: "Food", date: "2026-04-07", timestamp: "2026-04-07T07:45:00.000Z" },
            { id: 5, amount: 1500.00, description: "Movie tickets", category: "Entertainment", date: "2026-04-06", timestamp: "2026-04-06T20:00:00.000Z" },
            { id: 6, amount: 25000.00, description: "Monthly rent payment", category: "Bills", date: "2026-04-01", timestamp: "2026-04-01T00:00:00.000Z" },
            { id: 7, amount: 2000.00, description: "Doctor consultation", category: "Healthcare", date: "2026-04-05", timestamp: "2026-04-05T14:30:00.000Z" },
            { id: 8, amount: 1800.00, description: "Lunch at restaurant", category: "Food", date: "2026-04-05", timestamp: "2026-04-05T12:30:00.000Z" },
            { id: 9, amount: 3000.00, description: "Gas for car", category: "Transport", date: "2026-04-04", timestamp: "2026-04-04T17:00:00.000Z" },
            { id: 10, amount: 6500.00, description: "Winter jacket", category: "Shopping", date: "2026-04-03", timestamp: "2026-04-03T16:45:00.000Z" },
            { id: 11, amount: 1200.00, description: "Netflix subscription", category: "Entertainment", date: "2026-04-01", timestamp: "2026-04-01T10:00:00.000Z" },
            { id: 12, amount: 5000.00, description: "Grocery shopping", category: "Food", date: "2026-04-02", timestamp: "2026-04-02T18:20:00.000Z" },
            { id: 13, amount: 2000.00, description: "Internet bill", category: "Bills", date: "2026-04-01", timestamp: "2026-04-01T09:00:00.000Z" },
            { id: 14, amount: 2500.00, description: "Pharmacy medicine", category: "Healthcare", date: "2026-04-04", timestamp: "2026-04-04T11:15:00.000Z" },
            { id: 15, amount: 1800.00, description: "Taxi to airport", category: "Transport", date: "2026-03-28", timestamp: "2026-03-28T06:00:00.000Z" }
        ];

        this.expenses = dummyExpenses;
        this.saveExpenses();
    }

    // Automatic category detection based on keywords
    detectCategory(description) {
        const desc = description.toLowerCase();
        
        // Food keywords
        if (desc.includes('pizza') || desc.includes('burger') || desc.includes('food') || 
            desc.includes('restaurant') || desc.includes('coffee') || desc.includes('lunch') || 
            desc.includes('dinner') || desc.includes('breakfast') || desc.includes('groceries') ||
            desc.includes('meal') || desc.includes('snack') || desc.includes('drink')) {
            return 'Food';
        }
        
        // Transport keywords
        if (desc.includes('uber') || desc.includes('taxi') || desc.includes('bus') || 
            desc.includes('train') || desc.includes('metro') || desc.includes('gas') || 
            desc.includes('petrol') || desc.includes('fuel') || desc.includes('parking') ||
            desc.includes('car') || desc.includes('bike') || desc.includes('transport')) {
            return 'Transport';
        }
        
        // Shopping keywords
        if (desc.includes('shoes') || desc.includes('clothes') || desc.includes('shopping') || 
            desc.includes('mall') || desc.includes('store') || desc.includes('amazon') || 
            desc.includes('buy') || desc.includes('purchase') || desc.includes('retail') ||
            desc.includes('product') || desc.includes('item') || desc.includes('goods')) {
            return 'Shopping';
        }
        
        // Entertainment keywords
        if (desc.includes('movie') || desc.includes('cinema') || desc.includes('game') || 
            desc.includes('concert') || desc.includes('theater') || desc.includes('netflix') || 
            desc.includes('spotify') || desc.includes('entertainment') || desc.includes('fun') ||
            desc.includes('party') || desc.includes('event') || desc.includes('show')) {
            return 'Entertainment';
        }
        
        // Bills keywords
        if (desc.includes('rent') || desc.includes('electricity') || desc.includes('water') || 
            desc.includes('internet') || desc.includes('phone') || desc.includes('bill') || 
            desc.includes('utility') || desc.includes('subscription') || desc.includes('insurance') ||
            desc.includes('mortgage') || desc.includes('tax')) {
            return 'Bills';
        }
        
        // Healthcare keywords
        if (desc.includes('doctor') || desc.includes('hospital') || desc.includes('medicine') || 
            desc.includes('pharmacy') || desc.includes('health') || desc.includes('dental') || 
            desc.includes('clinic') || desc.includes('medical') || desc.includes('healthcare') ||
            desc.includes('treatment') || desc.includes('checkup')) {
            return 'Healthcare';
        }
        
        // Default to Other
        return 'Other';
    }

    // Add new expense
    addExpense() {
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        
        if (!amount || !description || !date) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const category = this.detectCategory(description);
        
        const expense = {
            id: Date.now(),
            amount: amount,
            description: description,
            category: category,
            date: date,
            timestamp: new Date().toISOString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        this.updateDashboard();
        
        // Reset form
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
        
        this.showNotification('Expense added successfully!', 'success');
    }

    // Save expenses to localStorage
    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    // Load expenses from localStorage
    loadExpenses() {
        const stored = localStorage.getItem('expenses');
        if (stored) {
            this.expenses = JSON.parse(stored);
        }
    }

    // Update entire dashboard
    updateDashboard() {
        this.updateStatistics();
        this.updateExpenseList();
        this.updateCharts();
        this.generateSuggestions();
    }

    // Update statistics cards
    updateStatistics() {
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const count = this.expenses.length;
        const average = count > 0 ? total / count : 0;
        
        // Find top category
        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
            categoryTotals[a] > categoryTotals[b] ? a : b, '-');
        
        document.getElementById('totalExpense').textContent = `PKR ${total.toFixed(2)}`;
        document.getElementById('topCategory').textContent = topCategory === '-' ? '-' : topCategory;
        document.getElementById('expenseCount').textContent = count;
        document.getElementById('avgExpense').textContent = `PKR ${average.toFixed(2)}`;
    }

    // Update expense list
    updateExpenseList(filteredExpenses = null) {
        const expenseList = document.getElementById('expenseList');
        const expenses = filteredExpenses || this.expenses;
        
        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">No expenses yet</div>
                    <div class="empty-state-text">Start adding expenses to see them here</div>
                </div>
            `;
            return;
        }

        // Sort expenses by date (newest first)
        const sortedExpenses = [...expenses].sort((a, b) => 
            new Date(b.date) - new Date(a.date));

        expenseList.innerHTML = sortedExpenses.map(expense => `
            <div class="expense-item fade-in">
                <div class="expense-info">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-meta">
                        <span class="category-badge category-${expense.category.toLowerCase()}">${expense.category}</span>
                        <span>${new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="expense-amount negative">-PKR ${expense.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }

    // Update charts
    updateCharts() {
        this.updateCategoryChart();
        this.updateMonthlyChart();
    }

    // Update category chart
    updateCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        // Calculate category totals
        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#ef4444', // Food - Red
                        '#3b82f6', // Transport - Blue
                        '#8b5cf6', // Shopping - Purple
                        '#f59e0b', // Entertainment - Orange
                        '#06b6d4', // Bills - Cyan
                        '#10b981', // Healthcare - Green
                        '#64748b'  // Other - Gray
                    ],
                    borderWidth: 2,
                    borderColor: '#1a1a3e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20,
                            font: {
                                size: 14,
                                weight: '600'
                            },
                            boxWidth: 15,
                            boxHeight: 15,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    const dataset = data.datasets[0];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    return data.labels.map((label, i) => {
                                        const value = dataset.data[i];
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return {
                                            text: `${label}: PKR ${value.toFixed(2)} (${percentage}%)`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.borderColor,
                                            lineWidth: dataset.borderWidth,
                                            hidden: false,
                                            index: i,
                                            fontColor: '#ffffff',
                                            font: {
                                                size: 14,
                                                weight: '600'
                                            }
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: PKR ${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Update monthly chart
    updateMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        // Calculate monthly totals
        const monthlyTotals = {};
        this.expenses.forEach(expense => {
            const month = expense.date.substring(0, 7); // YYYY-MM
            monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
        });

        // Sort months
        const sortedMonths = Object.keys(monthlyTotals).sort();
        const labels = sortedMonths.map(month => {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        const data = sortedMonths.map(month => monthlyTotals[month]);

        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }

        this.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                return 'PKR ' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Generate intelligent suggestions
    generateSuggestions() {
        const suggestionsList = document.getElementById('suggestionsList');
        const suggestions = [];

        if (this.expenses.length === 0) {
            suggestionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-text">Add expenses to get personalized suggestions</div>
                </div>
            `;
            return;
        }

        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Calculate category percentages
        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        // Generate suggestions based on spending patterns
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = (amount / total) * 100;

            if (category === 'Food' && percentage > 40) {
                suggestions.push({
                    type: 'warning',
                    text: `You're spending ${percentage.toFixed(1)}% on food. Consider meal planning to reduce costs.`
                });
            } else if (category === 'Shopping' && percentage > 30) {
                suggestions.push({
                    type: 'danger',
                    text: `Shopping accounts for ${percentage.toFixed(1)}% of your expenses. Try setting a monthly budget.`
                });
            } else if (category === 'Transport' && percentage > 25) {
                suggestions.push({
                    type: 'warning',
                    text: `Transport costs are ${percentage.toFixed(1)}% of total. Consider carpooling or public transport.`
                });
            }
        });

        // Check for unusual spending patterns
        if (this.expenses.length > 5) {
            const recentExpenses = this.expenses.slice(-5);
            const recentTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const recentAverage = recentTotal / 5;
            
            const overallAverage = total / this.expenses.length;
            
            if (recentAverage > overallAverage * 1.5) {
                suggestions.push({
                    type: 'warning',
                    text: 'Your recent spending is higher than usual. Review your latest expenses.'
                });
            }
        }

        // Positive suggestions
        if (total < 50000) {
            suggestions.push({
                type: 'success',
                text: 'Great job keeping your expenses low! Consider setting savings goals.'
            });
        }

        // Budget suggestions
        if (total > 200000) {
            suggestions.push({
                type: 'danger',
                text: `Monthly total of PKR ${total.toFixed(2)} is quite high. Review and categorize your expenses.`
            });
        }

        // Display suggestions
        if (suggestions.length === 0) {
            suggestions.push({
                type: 'success',
                text: 'Your spending looks balanced! Keep tracking your expenses for better insights.'
            });
        }

        suggestionsList.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item ${suggestion.type}">
                <div class="suggestion-text">${suggestion.text}</div>
            </div>
        `).join('');
    }

    // Filter expenses
    filterExpenses() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const monthFilter = document.getElementById('monthFilter').value;

        let filtered = this.expenses;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.category.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(expense => expense.category === categoryFilter);
        }

        // Month filter
        if (monthFilter) {
            filtered = filtered.filter(expense => expense.date.startsWith(monthFilter));
        }

        this.updateExpenseList(filtered);
    }

    // Show notification (simple implementation)
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#3b82f6';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data (bonus feature)
    exportData() {
        const dataStr = JSON.stringify(this.expenses, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `expenses_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Clear all data (bonus feature)
    clearAllData() {
        if (confirm('Are you sure you want to delete all expenses? This cannot be undone.')) {
            this.expenses = [];
            this.saveExpenses();
            this.updateDashboard();
            this.showNotification('All expenses cleared', 'success');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExpenseAnalyzer();
});

// Add some utility functions for future enhancements
const utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Get month name
    getMonthName: (monthIndex) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    },

    // Generate random color
    generateColor: () => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};
