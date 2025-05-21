document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Chart.js and Theme Toggle Logic ---
    const initialData = {
        день: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            income: [4000, 3800, 5000, 2700, 4500, 6100, 3900],
            expense: [3000, 2800, 3800, 2000, 3700, 4700, 2500],
        },
        неделя: {
            labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'],
            income: [25000, 28000, 22000, 30000],
            expense: [18000, 20000, 15000, 22000],
        },
        месяц: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            income: [120000, 130000, 110000, 140000, 150000, 135000, 160000, 155000, 145000, 165000, 170000, 180000],
            expense: [80000, 85000, 75000, 90000, 95000, 88000, 100000, 98000, 92000, 105000, 110000, 120000],
        },
        год: {
            labels: ['2022', '2023', '2024', '2025'],
            income: [1500000, 1800000, 1700000, 2000000],
            expense: [1000000, 1200000, 1100000, 1300000],
        }
    };

    let currentChartData = initialData.день;

    const cashflowChartElement = document.getElementById('cashflowChart');
    let cashflowChart;

if (cashflowChartElement) {
    const ctx = cashflowChartElement.getContext('2d');
    cashflowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: currentChartData.labels,
            datasets: [
                {
                    label: 'Доходы',
                    data: currentChartData.income,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--income-purple').trim(),
                    backgroundColor: hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--income-purple').trim(), 0.1),
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--income-purple').trim(),
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--income-purple').trim(),
                    pointHoverBorderColor: '#fff'
                },
                {
                    label: 'Расходы',
                    data: currentChartData.expense,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--expense-purple').trim(),
                    backgroundColor: hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--expense-purple').trim(), 0.1),
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--expense-purple').trim(),
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--expense-purple').trim(),
                    pointHoverBorderColor: '#fff'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        // ИЗМЕНЕНО ЗДЕСЬ
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary-color').trim()
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--activity-border').trim(),
                        drawBorder: false
                    },
                    ticks: {
                        // И ИЗМЕНЕНО ЗДЕСЬ
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary-color').trim(),
                        callback: function(value) {
                            if (value === 0) return '0';
                            if (value >= 1000 || value <= -1000) return value / 1000 + 'K';
                            return value;
                        }
                    },
                    suggestedMin: 0,
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary-color').trim(),
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                    tooltip: {
                        backgroundColor: document.body.classList.contains('light-theme') ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 30, 0.8)',
                        titleColor: document.body.classList.contains('light-theme') ? '#333333' : '#ffffff',
                        bodyColor: document.body.classList.contains('light-theme') ? '#333333' : '#ffffff',
                        caretSize: 5,
                        cornerRadius: 4,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: ₸${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    }


    function hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return `rgba(${+r},${+g},${+b},${alpha})`;
    }

    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            timeFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.textContent.toLowerCase();
            currentChartData = initialData[filterType] || initialData.день;
            updateChartData();
        });
    });

    function updateChartData() {
        if (cashflowChart) {
            cashflowChart.data.labels = currentChartData.labels;
            cashflowChart.data.datasets[0].data = currentChartData.income;
            cashflowChart.data.datasets[1].data = currentChartData.expense;
            cashflowChart.update();
        }
    }

    const themeToggleInput = document.getElementById('themeToggleInput'); // Corrected ID
    if (themeToggleInput) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggleInput.checked = true;
        }
        
        themeToggleInput.addEventListener('change', function() {
            const isLight = this.checked;
            if (isLight) {
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
            }
            if (cashflowChart) { // Check if chart exists before updating colors
                updateChartColors(isLight);
            }
        });
    }
    


    function updateChartColors(isLight) {
        if (!cashflowChart) return; // Guard clause if chart is not initialized

        const incomeColor = getComputedStyle(document.documentElement).getPropertyValue('--income-purple').trim();
        const expenseColor = getComputedStyle(document.documentElement).getPropertyValue('--expense-purple').trim();
        const textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary-color').trim();
        const activityBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--activity-border').trim();
        const tooltipBgColor = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 30, 0.8)';
        const tooltipTextColor = isLight ? '#333333' : '#ffffff';

        cashflowChart.data.datasets[0].borderColor = incomeColor;
        cashflowChart.data.datasets[0].backgroundColor = hexToRgba(incomeColor, 0.1);
        cashflowChart.data.datasets[0].pointBackgroundColor = incomeColor;
        // Дополнительно можно обновить pointHoverBackgroundColor, если это необходимо
        cashflowChart.data.datasets[0].pointHoverBackgroundColor = incomeColor;


        cashflowChart.data.datasets[1].borderColor = expenseColor;
        cashflowChart.data.datasets[1].backgroundColor = hexToRgba(expenseColor, 0.1);
        cashflowChart.data.datasets[1].pointBackgroundColor = expenseColor;
        // Дополнительно можно обновить pointHoverBackgroundColor
        cashflowChart.data.datasets[1].pointHoverBackgroundColor = expenseColor;

        cashflowChart.options.scales.x.ticks.color = textSecondaryColor;
        cashflowChart.options.scales.y.ticks.color = textSecondaryColor;
        cashflowChart.options.scales.y.grid.color = activityBorderColor;

        cashflowChart.options.plugins.tooltip.backgroundColor = tooltipBgColor;
        cashflowChart.options.plugins.tooltip.titleColor = tooltipTextColor;
        cashflowChart.options.plugins.tooltip.bodyColor = tooltipTextColor;

        if (cashflowChart.options.plugins.legend.display) {
            cashflowChart.options.plugins.legend.labels.color = textSecondaryColor;
        }
        cashflowChart.update();
    }

    if (cashflowChart) { // Initial call only if chart exists
        updateChartColors(document.body.classList.contains('light-theme'));
    }

    // --- New Sidebar Toggle Logic ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content'); // Or a more specific selector if needed

    if (sidebar && sidebarToggleBtn && mainContent) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('sidebar-open'); // Optional: for effects on main content
            // You might want to save sidebar state in localStorage too
        });

        // Close sidebar if user clicks outside of it on mobile
        document.addEventListener('click', function(event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggleButton = sidebarToggleBtn.contains(event.target);

            if (!isClickInsideSidebar && !isClickOnToggleButton && sidebar.classList.contains('open')) {
                if (window.innerWidth < 768) { // Only apply this behavior on mobile
                    sidebar.classList.remove('open');
                    mainContent.classList.remove('sidebar-open');
                }
            }
        });
    }
    
    // Ensure chart resizes correctly if the window size changes (e.g., sidebar toggling)
    // This is often handled by Chart.js responsive option, but an explicit resize can be useful.
    if (sidebarToggleBtn && cashflowChart) {
        sidebarToggleBtn.addEventListener('click', () => {
            // Give a slight delay for the sidebar transition to complete
            setTimeout(() => {
                cashflowChart.resize();
            }, 350); // Match CSS transition duration
        });
    }
    
    window.addEventListener('resize', () => {
        if (cashflowChart) {
            cashflowChart.resize();
        }
        // Ensure sidebar visibility is correct on resize
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('open'); // Remove 'open' if we go to desktop view
            mainContent.classList.remove('sidebar-open');
            sidebar.classList.remove('collapsed'); // Ensure it's not in a 'collapsed' state from mobile
            sidebar.style.transform = ''; // Reset any direct transform styles
        } else {
            // If sidebar was open and screen resizes to mobile, it should remain open or closed based on 'open' class
            // If it wasn't 'open', it should remain hidden (translateX(-100%))
            if (!sidebar.classList.contains('open')) {
                 sidebar.classList.add('collapsed'); // Use collapsed for initial hidden state on mobile
            }
        }
    });
    
    // Initial check for sidebar state on mobile
    if (window.innerWidth < 768) {
        if (!sidebar.classList.contains('open')) {
            sidebar.classList.add('collapsed'); // Start collapsed on mobile
        }
    }


    // --- Fetch data for dashboard cards (from index.html) ---
    // This is mock data fetching. Replace with your actual API calls.
    function fetchData() {
        // Mock API responses
        const mockApiData = {
            totalUsers: 1234,
            activeSubscriptions: 567,
            totalRevenue: 7890.12,
            recentSubscriptions: [
                { user: "User A", plan: "Premium", date: "2024-05-19" },
                { user: "User B", plan: "Basic", date: "2024-05-18" },
            ],
            recentUsers: [
                { name: "User C", joined: "2024-05-19" },
                { name: "User D", joined: "2024-05-17" },
            ]
        };

        const totalUsersEl = document.getElementById('totalUsers');
        const activeSubscriptionsEl = document.getElementById('activeSubscriptions');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const recentSubscriptionsEl = document.getElementById('recentSubscriptions');
        const recentUsersEl = document.getElementById('recentUsers');

        if (totalUsersEl) totalUsersEl.textContent = mockApiData.totalUsers.toLocaleString();
        if (activeSubscriptionsEl) activeSubscriptionsEl.textContent = mockApiData.activeSubscriptions.toLocaleString();
        if (totalRevenueEl) totalRevenueEl.textContent = `₸${mockApiData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        if (recentSubscriptionsEl) {
            recentSubscriptionsEl.innerHTML = mockApiData.recentSubscriptions.map(sub => `
                <div class="p-3 rounded-lg shadow-sm" style="background-color: var(--bg-card-alt, var(--bg-card)); border: 1px solid var(--border-color);">
                    <p class="font-semibold text-sm">${sub.user} - ${sub.plan}</p>
                    <p class="text-xs text-gray-400">${sub.date}</p>
                </div>
            `).join('');
        }

        if (recentUsersEl) {
            recentUsersEl.innerHTML = mockApiData.recentUsers.map(user => `
                <div class="p-3 rounded-lg shadow-sm" style="background-color: var(--bg-card-alt, var(--bg-card)); border: 1px solid var(--border-color);">
                    <p class="font-semibold text-sm">${user.name}</p>
                    <p class="text-xs text-gray-400">Joined: ${user.joined}</p>
                </div>
            `).join('');
        }
    }

    // Check if we are on a page that needs this data (e.g., the dashboard from index.html)
    if (document.querySelector('.stats-grid')) {
        fetchData();
    }

});
