# Frontend API Guide

This document describes how the frontend uses the backend API for the learn page and related flows.

---

## Learn page: course and lessons

**Endpoint:** `GET /api/student/courses/:id` (with student auth)

Used on the learn page (`/dashboard/courses/:id/learn`). Returns full course data including chapters and lessons.

### Course response (simplified)

```json
{
  "course": {
    "id": "course-uuid",
    "title": "Course title",
    "subtitle": "...",
    "chapters": [
      {
        "id": "chapter-uuid",
        "title": "Chapter title",
        "lessons": [
          {
            "id": "lesson-uuid",
            "title": "Lesson title",
            "description": "...",
            "order": 1,
            "durationMinutes": 15,
            "type": "VIDEO",
            "videoUrl": "https://...",
            "audioUrl": null,
            "contentUrl": null,
            "textContent": null
          }
        ]
      }
    ]
  }
}
```

### Lesson object

Each item in `course.chapters[].lessons[]` includes:

- **`type`** – One of: `"VIDEO"`, `"AUDIO"`, `"PDF"`, `"TEXT"`, `"QUIZ"`.
- **`videoUrl`** – Used when `type === 'VIDEO'` (absolute URL).
- **`audioUrl`** – Used when `type === 'AUDIO'` (absolute URL).
- **`contentUrl`** – Used when `type === 'PDF'` (absolute URL).
- **`textContent`** – Used when `type === 'TEXT'` or `type === 'QUIZ'` (HTML or Markdown).

**How to display each lesson type:** see [LESSON_CONTENT_DISPLAY.md](./LESSON_CONTENT_DISPLAY.md). That guide explains which field to use for each `lesson.type` and gives copy-paste examples (video, audio, PDF, text/quiz) and a single `LessonContent`-style component that branches on `lesson.type`.

---

## Summary

- Load the current lesson from the course/chapters/lessons data returned by `GET /api/student/courses/:id`.
- Switch on `lesson.type` and render VIDEO (videoUrl), AUDIO (audioUrl), PDF (contentUrl), or TEXT/QUIZ (textContent) as described in LESSON_CONTENT_DISPLAY.md.
