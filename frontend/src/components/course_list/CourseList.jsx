import "./CourseList.scss";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DATABASE_URL } from "../../lib/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { FaHeart } from "react-icons/fa";

function CourseList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLikes, setUserLikes] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newCourse, setNewCourse] = useState({
        _id: uuidv4(),
        title: "",
        instructor: "",
        description: "",
        image: "",
        enrollmentStatus: "",
        duration: "",
        schedule: "",
        location: "",
        Prerequisites: "",
        syllabus: [{ week: 1, topic: "" }, { week: 2, topic: "" }, { week: 3, topic: "" }]
    });

    // Fetch courses from Firebase
    useEffect(() => {
        axios.get(`${DATABASE_URL}/courses.json`)
            .then((response) => {
                const fetchedCourses = response.data ? Object.values(response.data) : [];
                setCourses(fetchedCourses);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setError("Failed to load courses.");
                setLoading(false);
            });
    }, []);

    // Filter courses by search term
    const filteredCourses = courses.filter((course) =>
        (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prevCourse) => ({
            ...prevCourse,
            [name]: value
        }));
    };

    // Handle form submission to add a new course
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newCourseWithId = { ...newCourse, _id: uuidv4() };

        axios.post(`${DATABASE_URL}/courses.json`, newCourseWithId)
            .then((response) => {
                setCourses((prevCourses) => [
                    ...prevCourses,
                    { ...newCourseWithId, _id: response.data.name }
                ]);
                setIsFormVisible(false);
                setNewCourse({  // Reset form
                    _id: uuidv4(),
                    title: "",
                    instructor: "",
                    description: "",
                    image: "",
                    enrollmentStatus: "",
                    duration: "",
                    schedule: "",
                    location: "",
                    Prerequisites: "",
                    syllabus: [{ week: 1, topic: "" }, { week: 2, topic: "" }, { week: 3, topic: "" }]
                });
            })
            .catch((error) => {
                console.error("Error adding course:", error);
                setError("Failed to add course.");
            });
    };

    // Handle Like button
    const handleLike = async (courseId, currentLikes = 0) => {
        const hasLiked = userLikes[courseId] || false;
        const newLikes = hasLiked ? currentLikes - 1 : currentLikes + 1;

        try {
            await axios.patch(`${DATABASE_URL}/courses/${courseId}.json`, { likes: newLikes });

            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course._id === courseId ? { ...course, likes: newLikes } : course
                )
            );

            setUserLikes((prevLikes) => ({
                ...prevLikes,
                [courseId]: !hasLiked,
            }));
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    return (
        <div className="course-dashboard">
            <div className="welcome-message">
                <h2>HI DIPESH SHRESTHA, WELCOME TO YOUR COURSES!</h2>
            </div>

            <div className="search-bar">
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
                <section className="courses">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div className="course-card-cont" key={course._id}>
                                <Link to={`/${course._id}`}>
                                    <div className="course-card">
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} className="course-image" />
                                        ) : (
                                            <div className="placeholder-image"></div>
                                        )}
                                        <div className="course-content">
                                            <h3>{course.title}</h3>
                                            <p><strong>Instructor:</strong> {course.instructor}</p>
                                            <p>{course.description}</p>
                                        </div>
                                    </div>
                                </Link>
                                <button onClick={() => handleLike(course._id, course.likes || 0)} className="like-btn">
                                    <FaHeart color={userLikes[course._id] ? "red" : "gray"} /> {course.likes || 0}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No courses found.</p>
                    )}
                    <div className="course-card">
                        <button className="AddBtn" onClick={() => setIsFormVisible(true)}>+</button>
                    </div>
                </section>
            )}

            {isFormVisible && (
                <div className="add-course-cont">
                    <button className="close-btn" onClick={() => setIsFormVisible(false)}>X</button>
                    <div className="add-course-form">

                    <form onSubmit={handleFormSubmit}>
                        <h3>Add New Course</h3>
                        <label>
                            Title:
                            <input type="text" name="title" value={newCourse.title} onChange={handleInputChange} required />
                        </label>
                        <label>
                            Instructor:
                            <input type="text" name="instructor" value={newCourse.instructor} onChange={handleInputChange} required />
                        </label>
                        <label>
                            Description:
                            <textarea name="description" value={newCourse.description} onChange={handleInputChange} required />
                        </label>
                        <label>
                            Image URL:
                            <input type="text" name="image" value={newCourse.image} onChange={handleInputChange} />
                        </label>
                        <label>
                            Enrollment Status:
                            <input type="text" name="enrollmentStatus" value={newCourse.enrollmentStatus} onChange={handleInputChange} />
                        </label>
                        <label>
                            Duration:
                            <input type="text" name="duration" value={newCourse.duration} onChange={handleInputChange} />
                        </label>
                        <label>
                            Schedule:
                            <input type="text" name="schedule" value={newCourse.schedule} onChange={handleInputChange} />
                        </label>
                        <label>
                            Location:
                            <input type="text" name="location" value={newCourse.location} onChange={handleInputChange} />
                        </label>
                        <label>
                            Prerequisites:
                            <input type="text" name="Prerequisites" value={newCourse.Prerequisites} onChange={handleInputChange} />
                        </label>
                        
                        {/* Syllabus Input Fields */}
                        <label>
                            Syllabus (Week/Topic):
                            {newCourse.syllabus.map((week, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        name={`syllabus_${index}_week`}
                                        value={week.topic}
                                        placeholder={`Week ${index + 1} Topic`}
                                        onChange={(e) => handleSyllabusChange(e, index)}
                                    />
                                </div>
                            ))}
                        </label>

                        <button type="submit">Add Course</button>
                    </form>
                </div>
                </div>
                
            )}

        </div>
    );
}

export default CourseList;
