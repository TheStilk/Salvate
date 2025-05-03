document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    // Profile update handler
    document.getElementById('profileForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        try {
            const response = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating profile.');
        }
    });

    // Password change handler
    document.getElementById('passwordForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        if (formData.get('new_password') !== formData.get('confirm_password')) {
            alert('New passwords do not match!');
            return;
        }
        
        try {
            const response = await fetch('/api/users/me/password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: formData.get('current_password'),
                    new_password: formData.get('new_password')
                })
            });
            
            if (response.ok) {
                alert('Password changed successfully!');
                event.target.reset();
            } else {
                alert('Failed to change password. Please check your current password.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while changing password.');
        }
    });
}); 