import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const VendorOrderHistory = () => {


    return (

        <div>
            <div className="card h-100 p-20 radius-12">
                <div className="card-body h-100 p-0 radius-12">
                    <div className="table-responsive scroll-sm">



                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                            <thead>
                                <tr>
                                    <th>S.No</th>

                                    <th>Order ID</th>

                                    <th>Order Date</th>
                                    <th>	Total Amount	</th>

                                    <th>Payment Status</th>
                                    <th>	Order Status	</th>

                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>

                                    <td>1</td>

                                    <td>#562353</td>
                                    <td>20 March 2025</td>
                                    <td>Rs. 75,000</td>
                                    <td>
                                        <div class="badge bg-success-subtle text-success font-size-12">Paid</div>
                                    </td>

                                    <td>
                                        <button type="button" class="btn btn-subtle-danger btn-sm waves-effect waves-light">Pending</button>
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
                                                    <a className="dropdown-item" >Download Invoice</a>

                                                </div>
                                            </li>
                                        </ul>
                                    </td>

                                </tr>

                                <tr>

                                    <td>2</td>

                                    <td>#562353</td>
                                    <td>20 March 2025</td>
                                    <td>Rs. 75,000</td>
                                    <td>
                                        <div class="badge bg-success-subtle text-success font-size-12">Paid</div>
                                    </td>

                                    <td>
                                        <button type="button" class="btn btn-subtle-danger btn-sm waves-effect waves-light">Pending</button>
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
                                                    <a className="dropdown-item" >Download Invoice</a>

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
                className="modal fade p-20"
                id="exampleModalView"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered ">


                    <div class="modal-content radius-16 bg-base p-20">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalEditLabel">Order Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card-body">

                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Order ID : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">#214569</span>
                                    </div>

                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Customer Name : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">Rajendran K</span>
                                    </div>

                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Customer Contact : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="fw-normal text-body">9876543210</span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Delivery address : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">45,Gandhipuram Main Road,Coimbatore,Tamil Nadu-641012</span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Product Name : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">Organic Turmeric Powder 200g Pack</span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Date &amp; Time : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="fw-normal text-body">10/12/2024 05:20 </span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Order Status : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">Pending </span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Payment Status : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class=" fw-normal text-body">Paid </span>
                                    </div>

                                </div>


                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <h5 class="font-size-14 py-2">Total Amount : </h5>
                                    </div>


                                    <div class="col-md-6">
                                        <span class="fw-normal text-body">₹ 45,000 </span>
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
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                Edit Transaction List
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div class="modal-body p-20">
                            <form>
                                <div class="row">

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Transaction ID

                                            </label>
                                            <input name="productname" type="text" class="form-control" />
                                        </div>
                                    </div>


                                    <div class="col-lg-6">

                                        <div class="mb-3">
                                            <label class="form-label" for="manufacturername">Order ID

                                            </label>
                                            <input name="Contact Person" type="text" class="form-control" />
                                        </div>
                                    </div>


                                </div>

                                <div class="row">

                                    <div class="col-lg-6">

                                        <div class="mb-3">
                                            <label class="form-label" for="manufacturerbrand">Customer/Wholesaler Name

                                            </label>
                                            <input name="Phone Number" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="price">Payment Date &amp; Time

                                            </label>
                                            <input name="price" type="text" class="form-control" />
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-lg-6">

                                        <div class="mb-3">
                                            <label class="form-label" for="manufacturername">Payment Method


                                            </label>
                                            <select class="form-control" name="payment-method">
                                                <option value="">Select Payment Method</option>
                                                <option value="cash">Cash</option>
                                                <option value="credit_card">Credit Card</option>
                                                <option value="debit_card">Debit Card</option>
                                                <option value="upi">UPI</option>
                                                <option value="wallet">Wallet</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="credit_account">Credit Account</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div class="col-lg-6">

                                        <div class="mb-6">
                                            <label class="form-label" for="manufacturerbrand">Amount Paid


                                            </label>
                                            <input name="GST Number" type="text" class="form-control" />
                                        </div>
                                    </div>

                                </div>



                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="choices-single-default" class="form-label">Payment Status
                                            </label>
                                            <select class="form-control" data-trigger="" name="choices-single-category" id="choices-single-category">
                                                <option value="">Select</option>
                                                <option value="EL">Paid</option>
                                                <option value="FA">Unpaid</option>
                                                <option value="FI">Partially Paid</option>
                                                <option value="FI">Refund</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="choices-single-specifications" class="form-label">Invoice Number
                                            </label>
                                            <input name="GST Number" type="text" class="form-control" />
                                        </div>
                                    </div>
                                </div>


                            </form>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-success waves-effect" data-bs-dismiss="modal">Save</button>
                                <button type="button" class="btn btn-danger waves-effect waves-light">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <div
                className="modal fade"
                id="exampleModalRefund"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                Process Refund
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div class="modal-body p-20">
                            <form>

                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Customer/Wholesaler Name


                                            </label>
                                            <input value="Radhakrishnan" name="productname" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Transaction ID


                                            </label>
                                            <input value="TS345678" name="productname" type="text" class="form-control" />
                                        </div>
                                    </div>



                                </div>


                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Order ID

                                            </label>
                                            <input name="productname" type="text" class="form-control" />
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Refund Amount


                                            </label>
                                            <input name="productname" type="text" class="form-control" />
                                        </div>
                                    </div>




                                </div>



                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="choices-single-default" class="form-label">Refund Method



                                            </label>
                                            <select class="form-select">
                                                <option selected="">Select option</option>
                                                <option>Bank Transfer
                                                </option>
                                                <option>UPI</option>
                                                <option>Wallet</option>
                                                <option>Credit Adjustment</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="choices-single-specifications" class="form-label">Refund Reason




                                            </label>
                                            <select class="form-select">
                                                <option selected="">Select option</option>
                                                <option>Order Cancellation</option>
                                                <option>Product Return</option>
                                                <option>Other</option>


                                            </select>
                                        </div>
                                    </div>




                                </div>



                            </form>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>


    );
};

export default VendorOrderHistory;