import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import apiProvider from '../../apiProvider/api';


const LatestRegisteredOne = () => {
    const [userList, setUserList] = useState([])
    const [usrCount, setUserCount] = useState(0)

    const fetchData = async () => {
        try {

            const getUserList = await apiProvider.getUsers();
            console.log(getUserList, "result-user");
            if (getUserList && getUserList.response && getUserList.response.data.data) {
                setUserList(getUserList.response.data.data);
                setUserCount(getUserList.response.data.data.length);
            }


        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="col-xxl-12 col-xl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex flex-wrap align-items-center gap-1 justify-content-between mb-16">
                        <ul
                            className="nav border-gradient-tab nav-pills mb-0"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center active"
                                    id="pills-to-do-list-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-to-do-list"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-to-do-list"
                                    aria-selected="true"
                                >
                                    Latest Registered Users
                                    <span className="text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert">
                                        {usrCount}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center"
                                    id="pills-recent-leads-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-recent-leads"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-recent-leads"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Recent Course Purchases
                                    {/* <span className="text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert">
                                        35
                                    </span> */}
                                </button>
                            </li>
                        </ul>
                        {/* <Link
                            to="#"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link> */}
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-to-do-list"
                            role="tabpanel"
                            aria-labelledby="pills-to-do-list-tab"
                            tabIndex={0}
                        >
                            <table className="table bordered-table sm-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <div className="d-flex align-items-center gap-10">
                                                S.No
                                            </div>
                                        </th>
                                        {/* <th scope="col">Id</th> */}
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col" className="text-center">
                                            Status
                                        </th>
                                        {/* <th scope="col" className="text-center">
                                                               Action
                                                           </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-10">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            {/* <td>{item.id}</td> */}
                                            <td>
                                                <span className="text-md mb-0 fw-normal text-secondary-light">
                                                    {item.userName}
                                                </span>
                                            </td>
                                            <td>{item.email}</td>
                                            <td className="text-center">
                                                <span className={`${item.status === "Active"
                                                    ? "bg-success-focus text-success-600 border border-success-border"
                                                    : "bg-danger-200 text-dander-600 border border-danger-400"
                                                    } px-24 py-4 radius-4 fw-medium text-sm`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            {/* <td>
                                                                   <div className="text-center">
                                                                       <button
                                                                           className="btn px-18 py-11 text-primary-light"
                                                                           type="button"
                                                                           data-bs-toggle="dropdown"
                                                                           aria-expanded="false"
                                                                       >
                                                                           <Icon icon="entypo:dots-three-vertical" className="menu-icon" />
                                                                       </button>
                                                                       <ul className="dropdown-menu">
                                                                           {["Active", "Inactive"].map(status => (
                                                                               <li key={status}>
                                                                                   <Link
                                                                                       className={`dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 
                                                                                                                      ${item.status === status ? "bg-primary-600 text-white" : ""}`}
                                                                                       to="#"
                                                                                       onClick={() => handleStatusChange(item.id, status)}
                                                                                   >
                                                                                       {status}
                                                                                   </Link>
                                                                               </li>
                                                                           ))}
                                                                       </ul>
                                                                   </div>
                                                               </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-recent-leads"
                            role="tabpanel"
                            aria-labelledby="pills-recent-leads-tab"
                            tabIndex={0}
                        >
                            <div className="table-responsive scroll-sm">
                                <table className="table bordered-table sm-table mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <div className="d-flex align-items-center gap-10">
                                                    S.No
                                                </div>
                                            </th>
                                            <th scope="col">Users </th>
                                            <th scope="col">Course Name</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Purchase Date</th>


                                            {/* <th scope="col" className="text-center">
                                                Status
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {/* <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="assets/images/users/user1.png"
                                                        alt=""
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            Dianne Russell
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            redaniel@gmail.com
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>27 Mar 2024</td>
                                            <td>Free</td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="assets/images/users/user2.png"
                                                        alt=""
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            Wade Warren
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            xterris@gmail.com
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>27 Mar 2024</td>
                                            <td>Basic</td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="assets/images/users/user3.png"
                                                        alt=""
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            Albert Flores
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            seannand@mail.ru
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>27 Mar 2024</td>
                                            <td>Standard</td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="assets/images/users/user4.png"
                                                        alt=""
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            Bessie Cooper{" "}
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            igerrin@gmail.com
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>27 Mar 2024</td>
                                            <td>Business</td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="assets/images/users/user5.png"
                                                        alt=""
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            Arlene McCoy
                                                        </h6>
                                                        <span className="text-sm text-secondary-light fw-medium">
                                                            fellora@mail.ru
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>27 Mar 2024</td>
                                            <td>Enterprise </td>
                                            <td className="text-center">
                                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                    Active
                                                </span>
                                            </td>
                                        </tr> */}
                                    </tbody>

                                </table>
                                <br>
                                </br>
                                <center style={{ display: "flex", justifyContent: "center" }}>
                                    No course purchases yet.
                                </center>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestRegisteredOne