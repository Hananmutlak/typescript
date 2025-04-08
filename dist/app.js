"use strict";
class CourseManager {
    constructor() {
        this.allCourses = [];
        this.loadCourses();
    }
    loadCourses() {
        const savedCourses = localStorage.getItem('my-courses');
        this.allCourses = savedCourses ? JSON.parse(savedCourses) : [];
    }
    saveCourses() {
        localStorage.setItem('my-courses', JSON.stringify(this.allCourses));
    }
    addNewCourse(newCourse) {
        if (this.allCourses.some(course => course.code === newCourse.code)) {
            return false;
        }
        this.allCourses.push(newCourse);
        this.saveCourses();
        return true;
    }
    getAllCourses() {
        return [...this.allCourses];
    }
    removeCourse(courseCode) {
        this.allCourses = this.allCourses.filter(course => course.code !== courseCode);
        this.saveCourses();
    }
}
const myCourseManager = new CourseManager();
function showCourses() {
    const coursesList = document.getElementById('courses-list');
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
            const code = event.target.getAttribute('data-code');
            myCourseManager.removeCourse(code);
            showCourses();
        });
    });
}
document.getElementById('course-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const codeInput = document.getElementById('course-code');
    const nameInput = document.getElementById('course-name');
    const levelSelect = document.getElementById('course-level');
    const syllabusInput = document.getElementById('syllabus-link');
    const newCourse = {
        code: codeInput.value.trim().toUpperCase(),
        name: nameInput.value.trim(),
        level: levelSelect.value,
        syllabus: syllabusInput.value.trim()
    };
    if (myCourseManager.addNewCourse(newCourse)) {
        showCourses();
        codeInput.value = '';
        nameInput.value = '';
        levelSelect.value = 'A';
        syllabusInput.value = 'https://webbutveckling.miun.se/files/ramschema_ht24.json';
    }
    else {
        alert('A course with this code already exists!');
    }
});
document.addEventListener('DOMContentLoaded', showCourses);
