import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentDashboard.scss";
import axios from "axios";
import { DATABASE_URL } from "../../lib/firebaseConfig";

function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from Firebase on mount
  useEffect(() => {
    axios.get(`${DATABASE_URL}/enrolledCourses.json`)
      .then((response) => {
        const courses = response.data ? Object.values(response.data) : [];
        setEnrolledCourses(courses);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Mark a course as completed
  const handleMarkComplete = (courseId) => {
    setCompletedCourses((prevCompleted) =>
      prevCompleted.includes(courseId)
        ? prevCompleted.filter((id) => id !== courseId)
        : [...prevCompleted, courseId]
    );
  };

  const filteredCourses = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-welcome-message">
        <h2>HI DIPESH SHRESTHA, WELCOME TO YOUR ENROLLED COURSES!</h2>
      </div>

      <div className="student-dashboard-search-bar">
        <input
          type="text"
          placeholder="Search courses by name or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-txt">Loading courses...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <section className="student-dashboard-courses">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course._id} className="student-dashboard-course-card">
                {course.image ? (
                  <div className="student-dashboard-course-image-cont">
                    <span className="access">{course.access}</span>
                    <img src={course.image} alt={course.title} className="student-dashboard-course-image" />
                  </div>
                ) : (
                  <div className="student-dashboard-placeholder-image"></div>
                )}
                <div className="student-dashboard-course-content">
                  
                  <h3>{course.title}</h3>
                  <p><strong>Instructor:</strong> {course.instructor}</p>
                  <p>{course.description}</p>
                  <div className="student-dashboard-progress-bar">
                    <div className="student-dashboard-progress" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <Link to="#" className="student-dashboard-btn-primary">Continue</Link>
                  <button
                    className={`student-dashboard-btn-secondary ${completedCourses.includes(course._id) ? "completed" : ""}`}
                    onClick={() => handleMarkComplete(course._id)}
                    disabled={completedCourses.includes(course._id)}
                  >
                    {completedCourses.includes(course._id) ? "Completed" : "Mark as Complete"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="student-dashboard-no-results">No courses found.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default StudentDashboard;
