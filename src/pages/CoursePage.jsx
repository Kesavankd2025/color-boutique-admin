import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CoursePageLayer from "../components/AddCategoryPage";




const CoursePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Course Form" header="Create Category" />

        {/* CoursePageLayer */}
        <CoursePageLayer />


      </MasterLayout>

    </>
  );
};

export default CoursePage;
