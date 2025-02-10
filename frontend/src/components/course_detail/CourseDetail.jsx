import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CourseDetail.scss";
import { DATABASE_URL } from "../../lib/firebaseConfig.js";

// Firebase Database URL for courses
function CourseDetail() {
  const { _id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course data from Firebase using Axios
  useEffect(() => {
    axios.get(`${DATABASE_URL}/courses.json`)
      .then((response) => {
        // Firebase response returns an object, convert it to an array
        const fetchedCourses = response.data ? Object.values(response.data) : [];
        const course = fetchedCourses.find((course) => course._id === _id);

        if (course) {
          setCourseData(course);
          setSyllabus(course.syllabus || []);
        } else {
          setError("Course not found.");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load course.");
        setLoading(false);
      });
  }, [_id]);

  if (loading) {
    return <p className="loading-txt">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const toggleExpand = (index) => {
    setSyllabus((prevSyllabus) =>
      prevSyllabus.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  return (
    <div className="course-details">
      <header className="header">
        <h1>{courseData.title}</h1>
        <p className="instructor">Instructor: {courseData.instructor}</p>
      </header>

      <section className="course-info">
        <p>{courseData.description}</p>
        <p><strong>Enrollment Status:</strong> {courseData.enrollmentStatus || "N/A"}</p>
        <p><strong>Duration:</strong> {courseData.duration || "N/A"}</p>
        <p><strong>Schedule:</strong> {courseData.schedule || "N/A"}</p>
        <p><strong>Location:</strong> {courseData.location || "N/A"}</p>
        <p><strong>Prerequisites:</strong> {courseData.Prerequisites || "N/A"}</p>
      </section>

      {syllabus.length > 0 && (
        <section className="syllabus">
          <h2>Syllabus</h2>
          <ul>
            {syllabus.map((item, index) => (
              <li key={index} className="syllabus-item">
                <div className="syllabus-header" onClick={() => toggleExpand(index)}>
                  <span>Week {item.week}: {item.topic}</span>
                  <button>{item.expanded ? "▲" : "▼"}</button>
                </div>
                {item.expanded && <p className="syllabus-content">Detailed content for {item.topic}.</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}

export default CourseDetail;
