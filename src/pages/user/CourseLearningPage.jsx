/**
 * Course Learning Page - For enrolled students to access course content
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { StudentService } from '@/services';
import { FiArrowLeft, FiPlay, FiCheck, FiLock, FiBook, FiClock } from 'react-icons/fi';
import { ROUTES } from '@/constants';

const CourseLearningContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['studentCourse', id],
    queryFn: () => StudentService.getCourseById(id),
    enabled: !!id,
    retry: 1,
    retryDelay: 1000,
  });

  // Check error types
  const isServerError = error?.status === 500 || 
                        error?.response?.status === 500 ||
                        (error?.message && error.message.includes('Server error'));
  
  const isNotFoundError = error?.status === 404 || 
                           error?.response?.status === 404 ||
                           (error?.message && error.message.toLowerCase().includes('not found'));
  
  const isUnauthorizedError = error?.status === 403 || 
                               error?.response?.status === 403 ||
                               error?.status === 401 ||
                               error?.response?.status === 401;

  const course = data?.course || data?.data?.course;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    let errorMessage = 'Failed to load course content';
    let errorDetails = null;

    if (isNotFoundError) {
      errorMessage = 'Course not found or you are not enrolled';
      errorDetails = (
        <div className="mt-4 text-sm text-gray-300">
          <p className="mb-2">This course may not be available or you may not be enrolled yet.</p>
          <p className="text-xs text-gray-400">
            If you recently purchased this course, please wait for admin verification. Once approved, the course will appear in "My Courses".
          </p>
        </div>
      );
    } else if (isUnauthorizedError) {
      errorMessage = 'You do not have access to this course';
      errorDetails = (
        <div className="mt-4 text-sm text-gray-300">
          <p className="mb-2">You need to be enrolled in this course to access its content.</p>
          <p className="text-xs text-gray-400">
            Please ensure your purchase has been verified by the admin.
          </p>
        </div>
      );
    } else if (isServerError) {
      errorMessage = 'Server error. Please try again later or contact support if the problem persists.';
      errorDetails = (
        <div className="mt-4 text-sm text-gray-300">
          <p className="font-medium mb-2">If this problem continues, please:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Refresh the page</li>
            <li>Check your internet connection</li>
            <li>Contact support if the issue persists</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-4">
              Error code: 500 - Internal Server Error. This is a backend issue that our team is working to resolve.
            </p>
          </div>
        </div>
      );
    } else {
      errorMessage = error.message || errorMessage;
    }

    return (
      <UserLayout>
        <div className="max-w-7xl">
          <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8">
            <ErrorMessage
              message={errorMessage}
              className="mb-4"
            />
            {errorDetails}
            <div className="mt-6 flex gap-3">
              <Link to={ROUTES.USER.COURSES} className="inline-block">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Back to My Courses
                </button>
              </Link>
              {!isNotFoundError && !isUnauthorizedError && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              )}
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!course) {
    return (
      <UserLayout>
        <div className="max-w-7xl">
          <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8">
            <ErrorMessage message="Course not found" className="mb-4" />
            <Link to={ROUTES.USER.COURSES}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Back to My Courses
              </button>
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  const chapters = course.chapters || [];
  const selectedChapter = chapters[selectedChapterIndex];
  const lessons = selectedChapter?.lessons || [];
  const selectedLesson = lessons[selectedLessonIndex];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={ROUTES.USER.COURSES}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 mb-4 transition-colors"
          >
            <FiArrowLeft />
            <span>Back to My Courses</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          {course.subtitle && (
            <p className="text-gray-400 mt-2">{course.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chapters and Lessons */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-4 sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiBook />
                Course Content
              </h2>
              
              <div className="space-y-2">
                {chapters.map((chapter, chapterIdx) => {
                  const isChapterActive = selectedChapterIndex === chapterIdx;
                  const chapterBgColor = isChapterActive ? (chapterIdx % 2 === 0 ? 'bg-blue-500' : 'bg-green-500') : '';
                  
                  return (
                    <div key={chapter.id || chapterIdx} className="border-b border-gray-800 pb-2 last:border-b-0">
                      <button
                        onClick={() => {
                          setSelectedChapterIndex(chapterIdx);
                          setSelectedLessonIndex(0);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          isChapterActive
                            ? `${chapterBgColor} text-white font-semibold`
                            : 'text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {chapter.title || `Chapter ${chapterIdx + 1}`}
                          </span>
                          <span className="text-xs text-gray-400">
                            {(chapter.lessons || []).length}
                          </span>
                        </div>
                      </button>
                      
                      {/* Lessons in this chapter */}
                      {isChapterActive && chapter.lessons && (
                        <div className="mt-2 ml-4 space-y-1">
                          {chapter.lessons.map((lesson, lessonIdx) => {
                            const isLessonActive = selectedLessonIndex === lessonIdx;
                            const lessonBgColor = isLessonActive ? (lessonIdx % 2 === 0 ? 'bg-blue-500' : 'bg-green-500') : '';
                            
                            return (
                              <button
                                key={lesson.id || lessonIdx}
                                onClick={() => setSelectedLessonIndex(lessonIdx)}
                                className={`w-full text-left p-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                  isLessonActive
                                    ? `${lessonBgColor} text-white font-medium`
                                    : 'text-gray-300 hover:bg-gray-800/50'
                                }`}
                              >
                                <FiPlay size={14} />
                                <span className="flex-1">{lesson.title || `Lesson ${lessonIdx + 1}`}</span>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <FiClock size={12} />
                                    {lesson.duration}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-6 md:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <span>{selectedChapter.title || `Chapter ${selectedChapterIndex + 1}`}</span>
                    <span>•</span>
                    <span>Lesson {selectedLessonIndex + 1} of {lessons.length}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedLesson.title || `Lesson ${selectedLessonIndex + 1}`}
                  </h2>
                  {selectedLesson.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiClock />
                      <span>{selectedLesson.duration} minutes</span>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="prose max-w-none prose-invert">
                  {selectedLesson.content ? (
                    <div 
                      className="text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                    />
                  ) : selectedLesson.description ? (
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {selectedLesson.description}
                    </p>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>Lesson content will be available here.</p>
                      <p className="text-sm mt-2">Video, text, or interactive content will appear in this area.</p>
                    </div>
                  )}

                  {/* Video URL if available */}
                  {selectedLesson.videoUrl && (
                    <div className="mt-6">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          src={selectedLesson.videoUrl}
                          controls
                          className="w-full h-full"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (selectedLessonIndex > 0) {
                        setSelectedLessonIndex(selectedLessonIndex - 1);
                      } else if (selectedChapterIndex > 0) {
                        const prevChapter = chapters[selectedChapterIndex - 1];
                        setSelectedChapterIndex(selectedChapterIndex - 1);
                        setSelectedLessonIndex((prevChapter.lessons || []).length - 1);
                      }
                    }}
                    disabled={selectedChapterIndex === 0 && selectedLessonIndex === 0}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => {
                      if (selectedLessonIndex < lessons.length - 1) {
                        setSelectedLessonIndex(selectedLessonIndex + 1);
                      } else if (selectedChapterIndex < chapters.length - 1) {
                        setSelectedChapterIndex(selectedChapterIndex + 1);
                        setSelectedLessonIndex(0);
                      }
                    }}
                    disabled={selectedChapterIndex === chapters.length - 1 && selectedLessonIndex === lessons.length - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-12 text-center">
                <FiBook className="mx-auto text-gray-500 mb-4" size={48} />
                <h2 className="text-xl font-semibold text-white mb-2">No content available</h2>
                <p className="text-gray-400">
                  {chapters.length === 0
                    ? 'This course does not have any chapters or lessons yet.'
                    : 'Select a lesson from the sidebar to view its content.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export const CourseLearningPage = () => {
  return (
    <ProtectedRoute>
      <CourseLearningContent />
    </ProtectedRoute>
  );
};

export default CourseLearningPage;
