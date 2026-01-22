# Profile Image Upload Guide

## ✅ Implementation Complete

The frontend has been updated to support profile image uploads using the new endpoint `/api/upload/profile-image`.

## 📋 How to Use

### Using UploadService (Recommended)

```javascript
import { UploadService } from '@/services';

// Upload profile image
const handleImageUpload = async (file) => {
  try {
    const response = await UploadService.uploadProfileImage(file);
    
    if (response.success) {
      const imageUrl = response.data.url; // or response.data.fullUrl
      console.log('Image uploaded successfully:', imageUrl);
      
      // Update user profile with image URL
      // await AuthService.updateProfile({ avatarUrl: imageUrl });
    }
  } catch (error) {
    console.error('Upload failed:', error.message);
    // Show error to user
  }
};
```

### Using Fetch Directly

```javascript
const formData = new FormData();
formData.append('image', file);

const token = localStorage.getItem('token');

const response = await fetch('/api/upload/profile-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
// Response: { success: true, data: { url, fullUrl, filename, ... } }
```

## 📝 Response Format

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "filename": "profile-1234567890-987654321.jpg",
    "originalName": "my-photo.jpg",
    "size": 245678,
    "mimetype": "image/jpeg",
    "url": "/uploads/images/profile-1234567890-987654321.jpg",
    "fullUrl": "http://localhost:3000/uploads/images/profile-1234567890-987654321.jpg"
  }
}
```

## ⚠️ Important Notes

1. **File Size Limit**: 10MB maximum for profile images
2. **Allowed File Types**: JPEG, PNG, GIF, WebP
3. **Authentication**: JWT token required (automatically included by UploadService)
4. **Field Name**: Must use `image` as the field name in FormData
5. **Endpoint**: `/api/upload/profile-image` (works for all authenticated users)

## 🔄 Difference from General Image Upload

- **`uploadImage()`**: Uses `/api/upload/image` - **Admin/Instructor only** (for course content)
- **`uploadProfileImage()`**: Uses `/api/upload/profile-image` - **All authenticated users** (for profile pictures)

## ✅ Features

- ✅ Automatic file size validation (10MB limit)
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ Automatic JWT token inclusion
- ✅ Connection reset error handling
- ✅ Detailed error messages
- ✅ Network error handling

## 🚀 Example: Adding to User Profile Page

```javascript
import { UploadService } from '@/services';
import { useState } from 'react';

const UserProfilePage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const response = await UploadService.uploadProfileImage(file);
      
      if (response.success) {
        // Update profile with image URL
        await AuthService.updateProfile({
          avatarUrl: response.data.url
        });
        // Refresh user data
        await refreshAuth();
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploadError && <p className="error">{uploadError}</p>}
    </div>
  );
};
```

## 🔍 Troubleshooting

### Still Getting ERR_CONNECTION_RESET?

1. **Check File Size**: Ensure image is under 10MB
2. **Check File Type**: Ensure it's JPEG, PNG, GIF, or WebP
3. **Check Authentication**: Ensure you're logged in (token exists)
4. **Check Backend**: Ensure backend endpoint is running and configured correctly

### Common Errors

- **403 Forbidden**: Using wrong endpoint (use `/api/upload/profile-image`, not `/api/upload/image`)
- **400 Bad Request**: Invalid file type or file too large
- **401 Unauthorized**: Not logged in or invalid token
- **413 Payload Too Large**: File exceeds 10MB limit

---

**The frontend is ready to use!** 🎉
