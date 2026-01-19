/**
 * Curriculum Builder Component
 * Drag & drop sections and lessons
 */

import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiChevronDown, FiChevronRight, FiLock, FiUnlock, FiMenu } from 'react-icons/fi';

export const CurriculumBuilder = ({ courseId, chapters = [], onUpdate }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      lessons: [],
    };
    onUpdate([...chapters, newSection]);
  };

  const handleAddLesson = (sectionId) => {
    const updatedChapters = chapters.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [
            ...(section.lessons || []),
            {
              id: Date.now(),
              title: 'New Lesson',
              type: 'video',
              duration: 0,
              isLocked: false,
              isPreview: false,
            },
          ],
        };
      }
      return section;
    });
    onUpdate(updatedChapters);
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section and all its lessons?')) {
      onUpdate(chapters.filter((section) => section.id !== sectionId));
    }
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    const updatedChapters = chapters.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return section;
    });
    onUpdate(updatedChapters);
  };

  const handleUpdateSection = (sectionId, field, value) => {
    const updatedChapters = chapters.map((section) => {
      if (section.id === sectionId) {
        return { ...section, [field]: value };
      }
      return section;
    });
    onUpdate(updatedChapters);
  };

  const handleUpdateLesson = (sectionId, lessonId, field, value) => {
    const updatedChapters = chapters.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
          ),
        };
      }
      return section;
    });
    onUpdate(updatedChapters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Curriculum</h3>
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
        >
          <FiPlus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
          <p className="text-gray-400 mb-4">No sections yet</p>
          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
          >
            Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {chapters.map((section) => (
            <div key={section.id} className="bg-[#1A1D29] border border-gray-800 rounded-lg overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-2 p-4 bg-gray-800 border-b border-gray-800">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400"
                >
                  {expandedSections[section.id] ? (
                    <FiChevronDown size={18} />
                  ) : (
                    <FiChevronRight size={18} />
                  )}
                </button>
                <FiMenu className="text-gray-500" size={18} />
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Section Title"
                />
                <span className="text-sm text-gray-400">
                  {section.lessons?.length || 0} lessons
                </span>
                <button
                  onClick={() => handleAddLesson(section.id)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                  title="Add Lesson"
                >
                  <FiPlus size={18} />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                  title="Delete Section"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* Lessons */}
              {expandedSections[section.id] && (
                <div className="p-4 space-y-2">
                  {section.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <FiMenu className="text-gray-500 cursor-move" size={18} />
                      <input
                        type="text"
                        value={lesson.title || ''}
                        onChange={(e) => handleUpdateLesson(section.id, lesson.id, 'title', e.target.value)}
                        className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Lesson Title"
                      />
                      <select
                        value={lesson.type || 'video'}
                        onChange={(e) => handleUpdateLesson(section.id, lesson.id, 'type', e.target.value)}
                        className="px-3 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="audio">Audio</option>
                        <option value="text">Text</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <button
                        onClick={() =>
                          handleUpdateLesson(section.id, lesson.id, 'isLocked', !lesson.isLocked)
                        }
                        className={`p-2 rounded ${
                          lesson.isLocked
                            ? 'text-red-400 hover:bg-red-500/20'
                            : 'text-green-400 hover:bg-green-500/20'
                        }`}
                        title={lesson.isLocked ? 'Unlock' : 'Lock'}
                      >
                        {lesson.isLocked ? <FiLock size={18} /> : <FiUnlock size={18} />}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateLesson(section.id, lesson.id, 'isPreview', !lesson.isPreview)
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          lesson.isPreview
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {lesson.isPreview ? 'Preview' : 'Locked'}
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(section.id, lesson.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                        title="Delete Lesson"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {(!section.lessons || section.lessons.length === 0) && (
                    <button
                      onClick={() => handleAddLesson(section.id)}
                      className="w-full py-2 text-sm text-gray-400 hover:text-blue-400 border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      + Add Lesson
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurriculumBuilder;

