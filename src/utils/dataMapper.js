/**
 * Data Mapper Utility
 * Transforms backend API responses to match frontend component expectations
 */

/**
 * Transform course data from backend to frontend format
 */
export const mapCourse = (course) => {
  if (!course) return null;

  const product = course.product || {};
  const instructors = course.instructors || [];
  const primaryInstructor = instructors.find(inst => inst.CourseInstructor?.role === 'primary') || instructors[0] || {};

  return {
    id: course.id,
    title: product.title || '',
    subtitle: product.subtitle || '',
    description: product.description || '',
    shortDescription: product.subtitle || product.description || '',
    price: parseFloat(product.price) || 0,
    currency: product.currency || 'USD',
    thumbnail: course.thumbnailUrl || product.thumbnailUrl || '',
    thumbnailUrl: course.thumbnailUrl || product.thumbnailUrl || '',
    level: course.level || '',
    language: course.language || '',
    rating: course.rating || 0,
    totalStudents: course.totalStudents || 0,
    totalChapters: course.totalChapters || 0,
    totalLessons: course.totalLessons || 0,
    durationMinutes: course.durationMinutes || 0,
    isPublished: product.isPublished || false,
    slug: product.slug || '',
    instructor: primaryInstructor ? {
      id: primaryInstructor.id,
      name: `${primaryInstructor.firstName || ''} ${primaryInstructor.lastName || ''}`.trim(),
      firstName: primaryInstructor.firstName || '',
      lastName: primaryInstructor.lastName || '',
      title: primaryInstructor.title || '',
      avatarUrl: primaryInstructor.avatarUrl || '',
    } : null,
    instructors: instructors.map(inst => ({
      id: inst.id,
      name: `${inst.firstName || ''} ${inst.lastName || ''}`.trim(),
      firstName: inst.firstName || '',
      lastName: inst.lastName || '',
      title: inst.title || '',
      avatarUrl: inst.avatarUrl || '',
      role: inst.CourseInstructor?.role || 'secondary',
    })),
    chapters: course.chapters || [],
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};

/**
 * Transform multiple courses
 */
export const mapCourses = (courses) => {
  if (!Array.isArray(courses)) return [];
  return courses.map(mapCourse);
};

/**
 * Transform instructor data from backend to frontend format
 */
export const mapInstructor = (instructor) => {
  if (!instructor) return null;

  return {
    id: instructor.id,
    firstName: instructor.firstName || '',
    lastName: instructor.lastName || '',
    name: `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim(),
    title: instructor.title || '',
    bio: instructor.bio || '',
    avatarUrl: instructor.avatarUrl || '',
    linkedinUrl: instructor.linkedinUrl || '',
    twitterUrl: instructor.twitterUrl || '',
    websiteUrl: instructor.websiteUrl || '',
    isActive: instructor.isActive !== undefined ? instructor.isActive : true,
    courses: instructor.courses ? instructor.courses.map(course => mapCourse(course)) : [],
    createdAt: instructor.createdAt,
    updatedAt: instructor.updatedAt,
  };
};

/**
 * Transform multiple instructors
 */
export const mapInstructors = (instructors) => {
  if (!Array.isArray(instructors)) return [];
  return instructors.map(mapInstructor);
};

/**
 * Transform user data from backend to frontend format
 */
export const mapUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    phone: user.phone || '',
    role: user.role || 'user',
    isEmailVerified: user.isEmailVerified || false,
    isActive: user.isActive !== undefined ? user.isActive : true,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

