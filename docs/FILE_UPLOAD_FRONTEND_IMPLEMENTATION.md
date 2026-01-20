# File Upload Frontend Implementation

This document describes the file upload system implementation in the frontend.

## Overview

The frontend now supports file uploads for course lessons, allowing instructors and admins to upload videos, audio files, PDFs, and images directly from their computer, or use external URLs.

## Components

### 1. Upload Service (`src/services/upload.service.js`)

The `UploadService` provides methods for uploading files and generating preview URLs:

#### Upload Methods:
- `uploadVideo(file)` - Upload video files (.mp4, .webm, .ogg, .mov, .avi)
- `uploadAudio(file)` - Upload audio files (.mp3, .wav, .ogg, .webm)
- `uploadPdf(file)` - Upload PDF files
- `uploadImage(file)` - Upload image files
- `uploadLesson(files)` - Upload multiple lesson files at once

#### Preview Methods:
- `getVideoPreviewUrl(filename)` - Get preview URL for videos
- `getAudioPreviewUrl(filename)` - Get preview URL for audio
- `getPdfPreviewUrl(filename)` - Get preview URL for PDFs
- `getImagePreviewUrl(filename)` - Get preview URL for images

#### Utility Methods:
- `extractFilename(url)` - Extract filename from URL

### 2. Lesson Editor Component (`src/components/admin/LessonEditor.jsx`)

A comprehensive component for editing individual lessons with:
- File upload functionality
- URL input for external links
- Preview functionality for all supported file types
- Duration input for video/audio lessons
- Text content editor for text lessons

**Features:**
- Collapsible editor (compact view by default)
- File upload with progress indication
- Preview modal for videos, audio, PDFs, and images
- Support for both file uploads and external URLs
- Type-specific UI (different inputs for video, audio, PDF, text, quiz)

### 3. Updated Curriculum Builder (`src/components/admin/CurriculumBuilder.jsx`)

The curriculum builder now integrates the `LessonEditor` component:
- Each lesson has an "Edit" button to expand the lesson editor
- File uploads are handled seamlessly
- Preview functionality is available for all lesson types

## API Endpoints

The frontend uses the following endpoints (defined in `src/constants/api.js`):

### Upload Endpoints:
- `POST /api/upload/video` - Upload video files
- `POST /api/upload/audio` - Upload audio files
- `POST /api/upload/pdf` - Upload PDF files
- `POST /api/upload/image` - Upload image files
- `POST /api/upload/lesson` - Upload multiple lesson files

### Preview Endpoints:
- `GET /api/upload/preview/video/:filename` - Preview videos
- `GET /api/upload/preview/audio/:filename` - Preview audio
- `GET /api/upload/preview/pdf/:filename` - Preview PDFs
- `GET /api/upload/preview/image/:filename` - Preview images

## Usage

### Uploading a File:

1. Navigate to the Course Editor (Admin Dashboard → Courses → Create/Edit Course)
2. Go to the "Curriculum" tab
3. Add a section and lesson
4. Click "Edit" on a lesson
5. Click "Upload File" and select a file
6. The file will be uploaded and the URL will be automatically filled

### Using External URLs:

1. In the lesson editor, enter the URL directly in the "File URL" field
2. The URL will be saved with the lesson

### Previewing Content:

1. After uploading a file or entering a URL, click "Preview"
2. A modal will open showing the content:
   - Videos: HTML5 video player with controls
   - Audio: HTML5 audio player with controls
   - PDFs: Embedded PDF viewer
   - Images: Full-size image display

## Supported File Types

### Video:
- `.mp4`, `.webm`, `.ogg`, `.mov`, `.avi`
- Max size: 500MB

### Audio:
- `.mp3`, `.wav`, `.ogg`, `.webm`
- Max size: 500MB

### PDF:
- `.pdf`
- Max size: 500MB

### Image:
- All common image formats
- Max size: 500MB

## Lesson Types

The system supports the following lesson types:

1. **VIDEO** - Video lessons with file upload or external URL
2. **AUDIO** - Audio lessons with file upload or external URL
3. **PDF** - PDF documents with file upload or external URL
4. **TEXT** - Text-based lessons (uses `textContent` field)
5. **QUIZ** - Quiz lessons (uses `contentUrl` or `textContent`)

## Data Structure

When a file is uploaded, the response includes:
```javascript
{
  success: true,
  data: {
    fullUrl: "http://localhost:3000/api/upload/preview/video/filename.mp4",
    filename: "filename.mp4"
  }
}
```

The `fullUrl` is automatically saved to the lesson's appropriate field:
- Video lessons → `videoUrl`
- Audio lessons → `audioUrl`
- PDF/Image lessons → `contentUrl`
- Text lessons → `textContent`
- Quiz lessons → `contentUrl`

## Error Handling

- Upload errors are displayed via `alert()` (can be enhanced with toast notifications)
- Network errors are caught and displayed
- File validation is handled by the backend (type and size)

## Future Enhancements

Potential improvements:
1. Progress bars for file uploads
2. Toast notifications instead of alerts
3. Drag-and-drop file upload
4. Multiple file upload at once
5. File size display before upload
6. Upload queue management
7. Retry failed uploads

## Testing

To test the file upload system:

1. Start the backend server (ensure file upload routes are enabled)
2. Start the frontend development server
3. Log in as admin or instructor
4. Navigate to Admin Dashboard → Courses
5. Create a new course or edit an existing one
6. Go to the Curriculum tab
7. Add a section and lesson
8. Click "Edit" on the lesson
9. Try uploading a file or entering a URL
10. Test the preview functionality

## Notes

- Files are uploaded with authentication (Bearer token)
- The upload service automatically handles development vs production URLs
- Preview URLs are generated based on the file type
- The system supports both file uploads and external URLs for maximum flexibility

