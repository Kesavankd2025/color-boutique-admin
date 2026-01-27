import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import useReactApexChart from '../../hook/useReactApexChart'
import { Link } from "react-router-dom";


const UnitCountTwo = () => {

    let { createChart } = useReactApexChart()



    return (
        <div className='card basic-data-table'>
            <div className='card-body py-80 px-32 text-center'>
                {/* <img src='assets/images/empty-state.png' alt='No Data' className='mb-24' /> */}
                <h6 className='mb-16'>No Purchase Data</h6>
                <p className='text-secondary-light'>
                    It looks like there are no course purchases yet. Once someone buys a course, it will appear here.
                </p>
                {/* <Link to='/courses' className='btn btn-primary-600 radius-8 px-20 py-11'>
                    Browse Courses
                </Link> */}
            </div>
        </div>
    )
}

export default UnitCountTwo