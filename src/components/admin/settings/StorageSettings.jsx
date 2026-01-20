/**
 * Storage Settings Component
 * File storage provider configuration
 */

import { useState } from 'react';
import { FiSave, FiHardDrive } from 'react-icons/fi';

export const StorageSettingsContent = () => {
  const [formData, setFormData] = useState({
    storageProvider: 'local',
    s3Bucket: '',
    s3Region: '',
    s3AccessKey: '',
    s3SecretKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    maxFileSize: 100,
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,mp4,mp3',
    cdnUrl: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving storage settings:', formData);
    alert('Storage settings saved! (This is a placeholder - connect to backend API)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Storage Provider */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Storage Provider</h3>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Provider</label>
          <select
            value={formData.storageProvider}
            onChange={(e) => handleChange('storageProvider', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="local">Local Storage</option>
            <option value="s3">AWS S3</option>
            <option value="cloudinary">Cloudinary</option>
            <option value="gcs">Google Cloud Storage</option>
            <option value="azure">Azure Blob Storage</option>
          </select>
        </div>
      </div>

      {/* AWS S3 Configuration */}
      {formData.storageProvider === 's3' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">AWS S3 Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">S3 Bucket Name</label>
              <input
                type="text"
                value={formData.s3Bucket}
                onChange={(e) => handleChange('s3Bucket', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">S3 Region</label>
              <input
                type="text"
                value={formData.s3Region}
                onChange={(e) => handleChange('s3Region', e.target.value)}
                placeholder="us-east-1"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Access Key ID</label>
              <input
                type="text"
                value={formData.s3AccessKey}
                onChange={(e) => handleChange('s3AccessKey', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Secret Access Key</label>
              <input
                type="password"
                value={formData.s3SecretKey}
                onChange={(e) => handleChange('s3SecretKey', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Configuration */}
      {formData.storageProvider === 'cloudinary' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Cloudinary Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cloud Name</label>
              <input
                type="text"
                value={formData.cloudinaryCloudName}
                onChange={(e) => handleChange('cloudinaryCloudName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
              <input
                type="text"
                value={formData.cloudinaryApiKey}
                onChange={(e) => handleChange('cloudinaryApiKey', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">API Secret</label>
              <input
                type="password"
                value={formData.cloudinaryApiSecret}
                onChange={(e) => handleChange('cloudinaryApiSecret', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* File Upload Limits */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">File Upload Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Max File Size (MB)</label>
            <input
              type="number"
              min="1"
              value={formData.maxFileSize}
              onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value) || 100)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Allowed File Types</label>
            <input
              type="text"
              value={formData.allowedFileTypes}
              onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
              placeholder="jpg,png,pdf,mp4"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated file extensions</p>
          </div>
        </div>
      </div>

      {/* CDN Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">CDN Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">CDN URL (Optional)</label>
          <input
            type="text"
            value={formData.cdnUrl}
            onChange={(e) => handleChange('cdnUrl', e.target.value)}
            placeholder="https://cdn.example.com"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <FiHardDrive className="text-blue-400" size={20} />
          <h4 className="text-white font-medium">Storage Usage</h4>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Used</p>
            <p className="text-xl font-bold text-white">0 GB</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Available</p>
            <p className="text-xl font-bold text-white">Unlimited</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Files</p>
            <p className="text-xl font-bold text-white">0</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
            transition-all duration-200 ease-in-out border-2 border-primary/80
            shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
            hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
            focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center gap-2"
        >
          <FiSave size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

