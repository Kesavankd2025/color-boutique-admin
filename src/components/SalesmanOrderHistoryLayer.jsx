import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const SalesmanOrderHistory = () => {


    return (

        <div>
            <div className="card h-100 p-20 radius-12">
                <div className="card-body h-100 p-0 radius-12">

                    <div class="d-flex flex-wrap align-items-center mb-3">
                        <h5 class="card-title me-2"> Salesman List </h5>
                        <div class="ms-auto">


                            <button type="button" class="btn btn-success waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">
                                 <Icon icon="mdi:plus-circle" className="menu-icon align-middle me-2" /> Salesman
                            </button>


                        </div>
                    </div>
                    <div className="table-responsive scroll-sm">



                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Salesman ID	</th>
                                    <th>Salesman Name</th>
                                    <th>Phone Number</th>
                                    <th>Email Address</th>
                                    <th>Assigned Wholesalers	</th>
                                    <th>Assigned Retailers</th>
                                    <th>Total Orders</th>
                                    <th>Total Sales Amount</th>
                                    <th>Sales Target Achieved	</th>
                                    <th>Incentives Earned</th>
                                    <th>Account Status</th>

                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>

                                    <td>1</td>
                                    <td>#562353</td>
                                    <td>Rajan</td>

                                    <td>98765 43210</td>
                                    <td>ravitraders@gmail.com</td>
                                    <td>80</td>
                                    <td>47</td>
                                    <td>800</td>
                                    <td>₹50,000
                                    </td>
                                    <td>₹61,000</td>
                                    <td>₹3500</td>
                                    <td>
                                        <span><span class="badge badge-pill bg-success-subtle text-success  font-size-12">Active</span></span>
                                    </td>

                                    <td>
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item dropdown">
                                                <a
                                                    className="text-muted font-size-18 px-2"
                                                    href="#"
                                                    role="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                >
                                                    <Icon icon="entypo:dots-three-horizontal" className="menu-icon" />
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-end">
                                                    <a className="dropdown-item" data-bs-toggle="modal"
                                                        data-bs-target="#exampleModalView"  >View</a>
                                                    <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">Edit</a>
                                                    <a className="dropdown-item" >Assign Clients</a>

                                                </div>
                                            </li>
                                        </ul>
                                    </td>

                                </tr>

                                <tr>

                                    <td>2</td>
                                    <td>#562355
                                    </td>
                                    <td>Kumar</td>

                                    <td>9001234567</td>
                                    <td>praveen@gmail.com</td>
                                    <td>80</td>
                                    <td>47</td>
                                    <td>800</td>
                                    <td>₹63,000
                                    </td>
                                    <td>₹70,000</td>
                                    <td>₹4500</td>
                                    <td>
                                        <span><span class="badge badge-pill bg-success-subtle text-success  font-size-12">Active</span></span>
                                    </td>

                                    <td>
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item dropdown">
                                                <a
                                                    className="text-muted font-size-18 px-2"
                                                    href="#"
                                                    role="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                >
                                                    <Icon icon="entypo:dots-three-horizontal" className="menu-icon" />
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-end">
                                                    <a className="dropdown-item" data-bs-toggle="modal"
                                                        data-bs-target="#exampleModalView"  >View</a>
                                                    <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">Edit</a>
                                                    <a className="dropdown-item" >Assign Clients</a>

                                                </div>
                                            </li>
                                        </ul>
                                    </td>

                                </tr>








                            </tbody>
                        </table>

                    </div>

                </div>
            </div>




            <div
                className="modal fade"
                id="exampleModalView"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">







                    <div class="modal-content radius-16 bg-base p-20">

                        <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 class="modal-title fs-5" id="exampleModalEditLabel">Salesman Details</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                        </div>

                        <div class="modal-body">
                            <div class="card-body">

                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Salesman Name
                                            : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="float-end fw-normal text-body">Kumar</span>
                                    </div>

                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Phone Number
                                            : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="float-end fw-normal text-body">9876543210</span>
                                    </div>

                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Email Address
                                            : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="float-end fw-normal text-body">kumar@gmail.com	</span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Employee ID
                                            : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="float-end fw-normal text-body">#562355
                                        </span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Region Assigned
                                            : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="float-end fw-normal text-body">Coimbatore South</span>
                                    </div>

                                </div>



                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>





            <div
                className="modal fade"
                id="exampleModalEdit"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">

                    <div class="modal-content radius-16 bg-base p-20">

                        <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 class="modal-title fs-5" id="addInvoiceModalLabel">Create Salesman</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                        </div>



                        <div class="modal-body">
                            <div class="card-body">

                                <form>

                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label class="form-label" for="productname">Salesman Name



                                                </label>
                                                <input id="productname" name="productname" type="text" class="form-control" />
                                            </div>
                                        </div>

                                        <div class="col-lg-6">

                                            <div class="mb-3">
                                                <label for="example-tel-input" class="form-label">Phone Number</label>

                                                <input class="form-control" type="tel" value="" id="example-tel-input" />


                                            </div>

                                        </div>

                                        <div class="row">

                                            <div class="col-lg-4">

                                                <div class="mb-3">
                                                    <label for="example-email-input" class="form-label">Email</label>

                                                    <input class="form-control" type="email" value="" id="example-email-input" />

                                                </div>

                                            </div>

                                            <div class="col-lg-4">
                                                <div class="mb-3">
                                                    <label for="employee-id" class="form-label">Employee ID</label>
                                                    <input id="employee-id" name="employee_id" type="text" class="form-control" />
                                                </div>
                                            </div>

                                            <div class="col-lg-4">
                                                <div class="mb-3">
                                                    <label for="region-assigned" class="form-label">Region Assigned</label>
                                                    <select id="region-assigned" name="region_assigned" class="form-select">
                                                        <option value="south">Select</option>

                                                    </select>
                                                </div>
                                            </div>

                                        </div>





                                    </div></form>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-success waves-effect" data-bs-dismiss="modal">Save</button>

                                    <button type="button" class="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>

                                </div>
                            </div>
                        </div>
                    </div>





                </div>
            </div>






        </div>


    );
};

export default SalesmanOrderHistory;