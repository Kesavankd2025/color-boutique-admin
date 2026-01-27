import React from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";


const Breadcrumb = ({ title,header }) => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/create-product');
  };
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
      <h6 className='fw-semibold mb-0'>{header || ""}</h6>
      
      {/* <button
        type='button'
        className='btn btn-success d-flex align-items-center gap-2'
        onClick={handleAddProduct}
      >
        <Icon icon='solar:plus-circle-bold' className='text-white' />
        {button || "+ Add Product"}
      </button> */}
    </div>
  );
};

export default Breadcrumb;
