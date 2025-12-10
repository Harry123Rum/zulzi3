// resources/js/services/userService.js

const API_URL = '/api';

const userService = {
    // Get user profile
    getProfile: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_URL}/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    // Upload profile picture
    uploadAvatar: async (file) => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${API_URL}/user/avatar`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error) {
            console.error('Upload avatar error:', error);
            throw error;
        }
    },
};

export default userService;