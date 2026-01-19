/**
 * Course Editor Component
 * Split screen with form on left and preview on right
 */

import { useState, useEffect } from 'react';
import { FiSave, FiEye, FiSmartphone, FiX } from 'react-icons/fi';
import { CurriculumBuilder } from './CurriculumBuilder';

export const CourseEditor = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    level: 'Beginner',
    language: 'English',
    isPublished: false,
    chapters: [],
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState('desktop');

  // Update form data when course prop changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        subtitle: course.subtitle || '',
        description: course.description || '',
        price: course.price || 0,
        thumbnailUrl: course.thumbnailUrl || course.thumbnail || '',
        level: course.level || 'Beginner',
        language: course.language || 'English',
        isPublished: course.isPublished !== undefined ? course.isPublished : false,
        chapters: course.chapters || course.curriculum || [],
      });
    } else {
      // Reset form for new course
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        price: 0,
        thumbnailUrl: '',
        level: 'Beginner',
        language: 'English',
        isPublished: false,
        chapters: [],
      });
    }
  }, [course]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'access', label: 'Access Rules' },
    { id: 'seo', label: 'SEO' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1A1D29]">
        <h2 className="text-xl font-bold text-white">
          {course ? 'Edit Course' : 'Create New Course'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Close"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 border-r border-gray-800 overflow-y-auto bg-[#1A1D29]">
          <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400 font-semibold'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleChange('level', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <CurriculumBuilder
              courseId={course?.id}
              chapters={formData.chapters}
              onUpdate={(chapters) => handleChange('chapters', chapters)}
            />
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4">
              <p className="text-gray-600">Access rules configuration coming soon</p>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <p className="text-gray-600">SEO settings coming soon</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => handleChange('isPublished', e.target.checked)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-700 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Published</span>
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
            >
              <FiSave size={18} />
              <span>Save Course</span>
            </button>
          </div>
        </div>
      </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-[#0F1117] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${
                  previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                <FiEye size={18} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${
                  previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                <FiSmartphone size={18} />
              </button>
            </div>
          </div>
          <div
            className={`bg-[#1A1D29] rounded-lg shadow-lg border border-gray-800 p-6 ${
              previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
            }`}
          >
            {formData.thumbnailUrl && (
              <img
                src={formData.thumbnailUrl}
                alt={formData.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-white mb-2">{formData.title || 'Course Title'}</h2>
            <p className="text-gray-400 mb-4">{formData.subtitle || 'Course Subtitle'}</p>
            <p className="text-sm text-gray-300 mb-4">{formData.description || 'Course description...'}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-400">${formData.price || 0}</span>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                {formData.level || 'Beginner'}
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CourseEditor;

