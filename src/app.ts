interface Course {
    code: string;
    name: string;
    level: 'A' | 'B' | 'C';
    syllabus: string;
  }
  
  class CourseManager {
    private allCourses: Course[] = [];
  
    constructor() {
      this.loadCourses();
    }
  
    private loadCourses(): void {
      const savedCourses = localStorage.getItem('my-courses');
      this.allCourses = savedCourses ? JSON.parse(savedCourses) : [];
    }
  
    private saveCourses(): void {
      localStorage.setItem('my-courses', JSON.stringify(this.allCourses));
    }
  
    addNewCourse(newCourse: Course): boolean {
      if (this.allCourses.some(course => course.code === newCourse.code)) {
        return false;
      }
      
      this.allCourses.push(newCourse);
      this.saveCourses();
      return true;
    }
  
    getAllCourses(): Course[] {
      return [...this.allCourses];
    }
  
    removeCourse(courseCode: string): void {
      this.allCourses = this.allCourses.filter(course => course.code !== courseCode);
      this.saveCourses();
    }
  }
  
  const myCourseManager = new CourseManager();
  
  function showCourses(): void {
    const coursesList = document.getElementById('courses-list')!;
    coursesList.innerHTML = '';
    
    const courses = myCourseManager.getAllCourses();
    
    if (courses.length === 0) {
      coursesList.innerHTML = '<p>No courses added yet.</p>';
      return;
    }
    
    courses.forEach(course => {
      const courseElement = document.createElement('div');
      courseElement.className = 'course-card';
      courseElement.innerHTML = `
        <h3>${course.code} - ${course.name}</h3>
        <p><strong>Level:</strong> ${course.level}</p>
        <p><strong>Syllabus:</strong> <a href="${course.syllabus}" target="_blank">View</a></p>
        <button class="delete-btn" data-code="${course.code}">Remove</button>
      `;
      coursesList.appendChild(courseElement);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const code = (event.target as HTMLElement).getAttribute('data-code')!;
        myCourseManager.removeCourse(code);
        showCourses();
      });
    });
  }
  
  document.getElementById('course-form')!.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const codeInput = document.getElementById('course-code') as HTMLInputElement;
    const nameInput = document.getElementById('course-name') as HTMLInputElement;
    const levelSelect = document.getElementById('course-level') as HTMLSelectElement;
    const syllabusInput = document.getElementById('syllabus-link') as HTMLInputElement;
    
    const newCourse: Course = {
      code: codeInput.value.trim().toUpperCase(),
      name: nameInput.value.trim(),
      level: levelSelect.value as 'A' | 'B' | 'C',
      syllabus: syllabusInput.value.trim()
    };
    
    if (myCourseManager.addNewCourse(newCourse)) {
      showCourses();
      codeInput.value = '';
      nameInput.value = '';
      levelSelect.value = 'A';
      syllabusInput.value = 'https://webbutveckling.miun.se/files/ramschema_ht24.json';
    } else {
      alert('A course with this code already exists!');
    }
  });
  
  document.addEventListener('DOMContentLoaded', showCourses);