/**
 * User Profile Page
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/services';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { validatePhone, normalizePhone, formatPhoneForDisplay } from '@/utils/phoneValidation';

const UserProfileContent = () => {
  const { user, refreshAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Clear error on change
    
    // Validate phone number in real-time
    if (name === 'phone') {
      const validation = validatePhone(value);
      setPhoneError(validation.isValid ? '' : validation.error);
    } else {
      setPhoneError('');
    }
  };

  const handleSave = async () => {
    setError('');
    setPhoneError('');
    setIsSaving(true);

    // Validate phone number before saving
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.error);
        setIsSaving(false);
        return;
      }
    }

    try {
      // Send firstName, lastName, and phone (email cannot be changed)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      
      // Only include phone if it's provided and valid
      if (formData.phone) {
        updateData.phone = normalizePhone(formData.phone);
      }
      
      const response = await AuthService.updateProfile(updateData);

      if (response.success) {
        // Refresh user data from context
        await refreshAuth();
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      // Provide more specific error messages based on error status
      const status = err.status || err.response?.status;
      
      if (status === 404) {
        setError('Profile update endpoint not found. The backend PUT /api/auth/me endpoint may not be configured. Please contact support.');
      } else if (status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (status === 403) {
        setError('You do not have permission to update your profile.');
      } else if (status === 400) {
        setError(err.message || 'Invalid data. Please check your input and try again.');
      } else {
        setError(err.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user values
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
    setError('');
    setPhoneError('');
    setIsEditing(false);
  };

  return (
    <UserLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-font-primary">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
          <h2 className="text-2xl font-bold text-font-primary mb-6">Profile Information</h2>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
              {isEditing ? (
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-lg text-font-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ) : (
                <div className="text-lg text-font-primary">{user?.firstName || 'N/A'}</div>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
              {isEditing ? (
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-lg text-font-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ) : (
                <div className="text-lg text-font-primary">{user?.lastName || 'N/A'}</div>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              {isEditing ? (
                <div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="+12345678901 or 123-456-78901"
                    className={`w-full px-4 py-2 border rounded-md text-lg text-font-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                      phoneError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Enter 11-15 digits. You can use spaces, dashes, or plus signs.
                  </p>
                </div>
              ) : (
                <div className="text-lg text-font-primary">
                  {user?.phone ? formatPhoneForDisplay(user.phone) : 'N/A'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <div className="text-lg text-font-primary">{user?.email || 'N/A'}</div>
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="pt-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export const UserProfilePage = () => {
  return (
    <ProtectedRoute>
      <UserProfileContent />
    </ProtectedRoute>
  );
};

export default UserProfilePage;
