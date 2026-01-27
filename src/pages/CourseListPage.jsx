import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CourseListPageLayer from "../components/CourseListPageLayer";


const CourseListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Course List Page" header="Courses" />

        {/* CoursePageLayer */}
        <CourseListPageLayer />


      </MasterLayout>

    </>
  );
};

export default CourseListPage;
