/**
 * Lesson Editor Component
 * Handles file uploads and previews for individual lessons
 */

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiEye, FiFile, FiVideo, FiMusic, FiFileText } from 'react-icons/fi';
import { UploadService } from '@/services';

export const LessonEditor = ({ lesson, onUpdate, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const lessonType = lesson?.type?.toLowerCase() || 'video';

  // Get the appropriate URL field based on lesson type
  const getUrlField = () => {
    switch (lessonType) {
      case 'video':
        return 'videoUrl';
      case 'audio':
        return 'audioUrl';
      case 'pdf':
        return 'contentUrl';
      case 'image':
        return 'contentUrl';
      case 'text':
        return 'textContent';
      case 'quiz':
        return 'contentUrl';
      default:
        return 'videoUrl';
    }
  };

  const getCurrentUrl = () => {
    const field = getUrlField();
    return lesson?.[field] || '';
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      let response;
      switch (lessonType) {
        case 'video':
          response = await UploadService.uploadVideo(file);
          break;
        case 'audio':
          response = await UploadService.uploadAudio(file);
          break;
        case 'pdf':
          response = await UploadService.uploadPdf(file);
          break;
        case 'image':
          response = await UploadService.uploadImage(file);
          break;
        default:
          throw new Error('Unsupported file type for upload');
      }

      if (response.success && response.data?.fullUrl) {
        const field = getUrlField();
        onUpdate({ ...lesson, [field]: response.data.fullUrl });
      }
    } catch (error) {
      globalThis.alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (value) => {
    const field = getUrlField();
    onUpdate({ ...lesson, [field]: value });
  };

  const handlePreview = () => {
    const url = getCurrentUrl();
    if (!url) {
      globalThis.alert('No file URL to preview');
      return;
    }

    // Extract filename from URL
    const filename = UploadService.extractFilename(url);
    
    // Get preview URL based on type
    let preview;
    switch (lessonType) {
      case 'video':
        preview = UploadService.getVideoPreviewUrl(filename);
        break;
      case 'audio':
        preview = UploadService.getAudioPreviewUrl(filename);
        break;
      case 'pdf':
        preview = UploadService.getPdfPreviewUrl(filename);
        break;
      case 'image':
        preview = UploadService.getImagePreviewUrl(filename);
        break;
      default:
        preview = url; // Use original URL for text/quiz
    }

    setPreviewUrl(preview);
    setShowPreview(true);
  };

  const getFileAcceptTypes = () => {
    switch (lessonType) {
      case 'video':
        return 'video/*,.mp4,.webm,.ogg,.mov,.avi';
      case 'audio':
        return 'audio/*,.mp3,.wav,.ogg,.webm';
      case 'pdf':
        return '.pdf';
      case 'image':
        return 'image/*';
      default:
        return '*';
    }
  };

  const getIcon = () => {
    switch (lessonType) {
      case 'video':
        return <FiVideo size={18} />;
      case 'audio':
        return <FiMusic size={18} />;
      case 'pdf':
        return <FiFileText size={18} />;
      default:
        return <FiFile size={18} />;
    }
  };

  if (!isExpanded) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-gray-400">{getIcon()}</div>
        <input
          type="text"
          value={lesson?.title || ''}
          onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
          className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Lesson Title"
        />
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
            transition-all duration-200 ease-in-out border-2 border-primary/80
            shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
            hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
            focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Edit Lesson: {lesson?.title || 'New Lesson'}</h4>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* File Upload Section */}
      {(lessonType === 'video' || lessonType === 'audio' || lessonType === 'pdf' || lessonType === 'image') && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            {lessonType === 'video' && 'Video'}
            {lessonType === 'audio' && 'Audio'}
            {lessonType === 'pdf' && 'PDF'}
            {lessonType === 'image' && 'Image'} File
          </label>
          
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={getFileAcceptTypes()}
              onChange={handleFileSelect}
              className="hidden"
              id={`file-upload-${lesson?.id}`}
            />
            <label
              htmlFor={`file-upload-${lesson?.id}`}
              className={`bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
                transition-all duration-200 ease-in-out border-2 border-primary/80
                shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
                hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
                focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)] flex items-center gap-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiUpload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            </label>
            
            {getCurrentUrl() && (
              <button
                onClick={handlePreview}
                className="bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
                  transition-all duration-200 ease-in-out border-2 border-primary/80
                  shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
                  hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
                  focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)] flex items-center gap-2"
              >
                <FiEye size={16} />
                <span>Preview</span>
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            Or enter URL manually:
          </div>
        </div>
      )}

      {/* URL/Content Input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {lessonType === 'text' ? 'Text Content' : lessonType === 'quiz' ? 'Quiz Content URL' : 'File URL'}
        </label>
        {lessonType === 'text' ? (
          <textarea
            value={getCurrentUrl()}
            onChange={(e) => handleUrlChange(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text content..."
          />
        ) : (
          <input
            type="text"
            value={getCurrentUrl()}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${lessonType} URL or upload file above`}
          />
        )}
      </div>

      {/* Duration Input (for video/audio) */}
      {(lessonType === 'video' || lessonType === 'audio') && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={lesson?.duration || 0}
            onChange={(e) => onUpdate({ ...lesson, duration: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D29] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewUrl(null);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {lessonType === 'video' && (
                <video
                  src={previewUrl}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: '70vh' }}
                />
              )}
              
              {lessonType === 'audio' && (
                <div className="bg-gray-800 rounded-lg p-8">
                  <audio src={previewUrl} controls className="w-full" />
                </div>
              )}
              
              {lessonType === 'pdf' && (
                <iframe
                  src={previewUrl}
                  className="w-full rounded-lg"
                  style={{ height: '70vh' }}
                  title="PDF Preview"
                />
              )}
              
              {lessonType === 'image' && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full rounded-lg"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;

