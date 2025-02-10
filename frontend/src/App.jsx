import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CourseList from './components/course_list/CourseList';
import CourseDetail from './components/course_detail/CourseDetail';
import StudentDashboard from './components/student_dash/StudentDashboard';
import Navbar from './components/navbar/Navbar';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      children : [
        {
          path: "/",
          element: <CourseList/>,
        },
        {
          path: "/:_id",
          element: <CourseDetail />,
        },
        {
          path: "/student-dashboard",
          element: <StudentDashboard />,
        }
      ]
    },
    
  ]);
  
  return (
    <RouterProvider router={router}/>
  );
}
export default App
