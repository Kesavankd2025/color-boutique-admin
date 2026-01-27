import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react';
import apiProvider from '../../apiProvider/api';
const UnitCountOne = () => {
    const [count, setCourseCount] = useState({ onlineCourses: 0, classRoomCoureses: 0, userCount: 0 })

    const fetchData = async () => {
        try {
            const result = await apiProvider.getCourse();
            console.log(result, "result-course");
            if (result && result.response && result.response.data && result.response.data.data) {
                let online = 0;
                let classrom = 0;
                result.response.data.data.map((ival) => {
                    if (ival.categoryType === "Online") {
                        online++
                    } else {
                        classrom++
                    }

                })
                setCourseCount((prev) => ({
                    ...prev,
                    onlineCourses: online,
                    classRoomCoureses: classrom,
                }));
            }


            const getUserList = await apiProvider.getUsers();
            console.log(getUserList, "result-user");
            if (getUserList && getUserList.response && getUserList.response.data.data) {
                // setUserData(result.response.data.data);
                setCourseCount((prev) => ({
                    ...prev,
                    userCount: getUserList.response.data.data.length,
                }));
            }


        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Users</p>
                                <h6 className="mb-0">{count.userCount}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="gridicons:multiple-users"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +5000
                            </span>
                            Last 30 days users
                        </p> */}
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">
                                    Total Online Courses
                                </p>
                                <h6 className="mb-0">{count.onlineCourses}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="fa-solid:award"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                                <Icon icon="bxs:down-arrow" className="text-xs" /> -800
                            </span>
                            Last 30 days subscription
                        </p> */}
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">
                                    Total Classroom Courses
                                </p>
                                <h6 className="mb-0">{count.classRoomCoureses}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="fa-solid:award"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +200
                            </span>
                            Last 30 days users
                        </p> */}
                    </div>
                </div>
                {/* card end */}
            </div>
        </div>

    )
}

export default UnitCountOne