document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    try {
        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            document.getElementById('totalSubscriptions').textContent = stats.total_users;
            document.getElementById('monthlyCost').textContent = `$${stats.revenue.toFixed(2)}`;
            document.getElementById('nextRenewal').textContent = stats.active_subscriptions;
        }

        // Fetch subscriptions
        const subscriptionsResponse = await fetch('/api/subscriptions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (subscriptionsResponse.ok) {
            const subscriptions = await subscriptionsResponse.json();
            const container = document.getElementById('subscriptionsContainer');
            container.innerHTML = subscriptions.map(sub => `
                <div class="subscription-card">
                    <h3>${sub.name}</h3>
                    <p>Price: $${sub.price}</p>
                    <p>Duration: ${sub.duration_days} days</p>
                    <p>Features: ${sub.features.join(', ')}</p>
                </div>
            `).join('');
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/dashboard/recent-activity', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (activityResponse.ok) {
            const activities = await activityResponse.json();
            const container = document.getElementById('activityContainer');
            container.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <p>${activity.description}</p>
                    <small>${new Date(activity.timestamp).toLocaleString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading dashboard data.');
    }
}); 