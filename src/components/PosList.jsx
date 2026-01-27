import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const PosList = () => {


    return (


        <div>
            <nav class="navbar navbar-expand-lg custom-navbar mt-3 ">


                <div class="container-fluid">


                    <button class="navbar-toggler ms-auto text-white border-0" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon one"></span>
                    </button>


                    <div class="collapse navbar-collapse" id="navbarResponsive">
                        <div class="row w-100">


                            <div class="col-12 col-lg-6 d-flex flex-column flex-lg-row  align-items-lg-center gap-3 py-2">
                                <a href="#" class="nav-link text-white d-flex align-items-center">
                                    <Icon icon="mdi:view-list" font="20" className="menu-icon posicon" /> Sales List
                                </a>
                                <a href="#" class="nav-link text-white d-flex align-items-center">
                                    <Icon icon="mdi:invoice-list-outline" className="menu-icon posicon" /> New Invoice
                                </a>

                                <a href="#" title="Click To View Hold Invoices" class="nav-link position-relative text-white">
                                    Hold List
                                </a>


                            </div>


                            <div class="col-12 col-lg-6 d-flex flex-column flex-lg-row  align-items-lg-center gap-2 py-2 justify-content-lg-end">


                            </div>

                        </div>
                    </div>
                </div>
            </nav>



            <div class="row mt-3">

                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-body">


                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <select class="form-select" id="toolSelect1" onchange="handleToolChange(this.value)">
                                            <option value="" selected disabled>Select Employee</option>
                                            <option value="sara">Miss.Sara</option>
                                            <option value="sofia">Miss.Sofia</option>
                                            <option value="alex">Mr.Alex</option>
                                            <option value="john">Mr.John</option>
                                            <option value="nicola">Miss.Nicola</option>
                                            <option value="jack">Mr.Jack</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-0">

                                        <select class="form-control" data-trigger name="choices-single-category"
                                            id="choices-single-category">
                                            <option value="">Customer Name</option>
                                            <option value="CUST001">John Doe(9876543210)</option>
                                            <option value="CUST002">Priya Sharma(9123456789)</option>
                                            <option value="CUST003">Ahmed Khan(9001234567)</option>
                                            <option value="CUST004">Lisa Ray(8899776655)</option>


                                        </select>
                                    </div>
                                </div>

                            </div>


                            <div class="table-responsive mb-3">
                                <table class="table table-bordered align-middle table-nowrap">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Discount</th>
                                            <th>Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Grocery Pack</td>
                                            <td>₹12,450</td>
                                            <td>2</td>
                                            <td>10%</td>
                                            <td>₹22,410</td>
                                        </tr>
                                        <tr>
                                            <td>Snack Bundle</td>
                                            <td>₹24,900</td>
                                            <td>1</td>
                                            <td>5%</td>
                                            <td>₹23,655</td>
                                        </tr>
                                        <tr>
                                            <td>Fresh Vegetables</td>
                                            <td>₹37,350</td>
                                            <td>1</td>
                                            <td>0%</td>
                                            <td>₹37,350</td>
                                        </tr>
                                        <tr>
                                            <td>Drinks & Beverages</td>
                                            <td>₹16,600</td>
                                            <td>3</td>
                                            <td>15%</td>
                                            <td>₹42,345</td>
                                        </tr>
                                        <tr>
                                            <td>Dairy Essentials</td>
                                            <td>₹9,960</td>
                                            <td>2</td>
                                            <td>20%</td>
                                            <td>₹15,936</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex align-items-center gap-2 flex-wrap mb-3">
                                <button type="button" class="btn btn-subtle-primary waves-effect waves-light" data-bs-toggle="tooltip" title="Invoice Date">
                                    <Icon icon="mdi:calendar-month" className="menu-icon posicon" />
                                </button>

                                <button type="button" class="btn btn-subtle-primary waves-effect waves-light" data-bs-toggle="tooltip" title="Coupon Discount">
                                    <Icon icon="mdi:ticket-percent-outline" className="menu-icon posicon" />
                                </button>

                                <div class="form-check ms-5">
                                    <input class="form-check-input mt-1 mr-5" type="checkbox" value="" id="checkbox1" />
                                    <label class="form-check-label" for="checkbox1">
                                        Send SMS to Customer
                                    </label>
                                </div>
                            </div>


                            <div class="row g-3 text-start">
                                <div class="col-md-4">
                                    <strong>Total Item:</strong>
                                    <span id="total_items_in_cart_without_quantity">5</span>
                                    (<span id="total_items_in_cart_with_quantity">9 Qty</span>)
                                    <span id="total_items_in_cart" class="d-none">9</span>
                                    <span id="is_hold_sale_id" class="d-none">0</span>
                                </div>

                                <div class="col-md-4">
                                    <strong>Tax:</strong>
                                    <span id="show_vat_modal">₹0.00</span>
                                </div>

                                <div class="col-md-4">
                                    <strong>Discount:</strong>
                                    <span id="show_discount_amount">₹15,174.00</span>
                                </div>
                            </div>

                            <div class="text-center p-3 bg-light rounded mb-3 mt-3">
                                <strong>Total Payable: ₹141,696.00</strong>
                            </div>


                            <div class="d-flex justify-content-between">
                                <button class="btn btn-danger w-100 me-2">Cancel</button>
                                <button class="btn btn-warning w-100 mx-2">Hold</button>
                                <button class="btn btn-success w-100 ms-2" data-bs-toggle="modal" data-bs-target="#paymentModal">
                                    Payment
                                </button>
                            </div>

                        </div>
                    </div>
                </div>






                <div class="col-xl-6">
                    <div class="card">
                        <div class="card-body">
                            <div>
                                <div class="row gy-3 align-items-center">


                                    <div class="col-12 col-md-6">
                                        <div class="search-box">
                                            <div class="position-relative">
                                                <input type="text" class="form-control bg-light border-light rounded" placeholder="Search by name,code.." />
                                                <Icon icon="mdi:search" className="menu-icon posicon search-icon position-absolute top-50 end-0 translate-middle-y me-3" />


                                            </div>
                                        </div>
                                    </div>


                                    <div class="col-12 col-md-6">
                                        <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
                                            <div class="search-box flex-grow-1">
                                                <div class="position-relative">
                                                    <input type="text"
                                                        class="form-control bg-light border-light rounded ps-5"
                                                        id="barcodeInput"
                                                        name="barcode"
                                                        placeholder="Barcode"
                                                        autofocus
                                                        onkeypress="handleBarcodeKey(event)" />

                                                    <Icon icon="mdi:barcode" className="menu-icon posicon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />

                                                </div>
                                            </div>
                                            <button type="button" class="btn btn-primary w-md-auto" onclick="submitBarcode()">Barcode</button>
                                        </div>
                                    </div>

                                </div>

                                <div class="tab-content p-3 text-muted mt-3 overflow-x-auto" style={{ maxHeight: "500px" }} >
                                    <div class="tab-pane active" id="popularity" role="tabpanel">
                                        <div class="row">

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-20 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-20 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Atta, Rice & Dal/Aashirvad.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-13 mb-0">Groceries</p>
                                                            <h5 class="mt-1 mb-0 text-body font-16">Ashirvad</h5>
                                                            <h5 class="font-20 text-primary mt-3 mb-0">₹260
                                                                <del class="text-muted font-15 fw-medium ps-1">₹280</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-20 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-20 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Biscuits & Cakes/choco bakes.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-13 mb-0">Snacks</p>
                                                            <h5 class="mt-1 mb-0 text-body font-size-16">Choco Bakes</h5>
                                                            <h5 class="font-size-20 text-primary mt-3 mb-0">₹180
                                                                <del class="text-muted font-size-15 fw-medium ps-1">₹200</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-3 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-3 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Dairy, Bread & Eggs/amul milk.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-size-13 mb-0">Dairy</p>
                                                            <h5 class="mt-1 mb-0 text-body font-size-16">Amul Milk</h5>
                                                            <h5 class="font-size-20 text-primary mt-3 mb-0">₹410
                                                                <del class="text-muted font-size-15 fw-medium ps-1">₹340</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-3 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-3 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Oil, Ghee & Masala/GOLD WINNER.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-size-13 mb-0">Cooking</p>
                                                            <h5 class="mt-1 mb-0 text-body font-size-16">Gold Winner</h5>
                                                            <h5 class="font-size-20 text-primary mt-3 mb-0">₹260
                                                                <del class="text-muted font-size-15 fw-medium ps-1">₹280</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-3 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-3 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Tea, Coffee & More/boost.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-size-13 mb-0">Drinks</p>
                                                            <h5 class="mt-1 mb-0 text-body font-size-16">Boost</h5>
                                                            <h5 class="font-size-20 text-primary mt-3 mb-0">₹260
                                                                <del class="text-muted font-size-15 fw-medium ps-1">₹280</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                            <div class="col-xl-4 col-sm-6">
                                                <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                                    <div class="product-box rounded p-3 mt-4 border bg-white">
                                                        <div class="product-img bg-light p-3 rounded">
                                                            <img src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/grocery/Vegetables & Fruits/banana.png" alt="" class="img-fluid mx-auto d-block" />
                                                        </div>
                                                        <div class="product-content pt-3">
                                                            <p class="text-muted font-size-13 mb-0">Fruits</p>
                                                            <h5 class="mt-1 mb-0 text-body font-size-16">Banana</h5>
                                                            <h5 class="font-size-20 text-primary mt-2 mb-0">₹260
                                                                <del class="text-muted font-size-15 fw-medium ps-1">₹280</del>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>

                                        </div>

                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>


            </div>






            <div id="myModal" class="modal fade" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-scroll="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="myModalLabel">Change Order Status</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div>
                                <h5 class="font-size-14 py-2">Order ID : <span class="float-end fw-normal text-body">#214569</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Customer Name : <span class="float-end fw-normal text-body">Subramnai R</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Product Name : <span class="float-end fw-normal text-body">Premium Basmati Rice 5kg Pack</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Current Status : <span class="float-end fw-normal text-body">Delivered</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">New Status : <span class="float-end fw-normal text-body"><select class="form-select">
                                    <option selected="">Select Status</option>
                                    <option value="AE">Pending </option>
                                    <option value="VI">Processing</option>
                                    <option value="MC">Shipped</option>
                                    <option value="DI">Delivered</option>
                                    <option value="DI">Cancelled</option>
                                    <option value="DI">Returned</option>

                                </select></span></h5>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="addInvoiceModalone" tabindex="-1" aria-labelledby="addInvoiceModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addInvoiceModalLabel">Product Name
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card-body">


                                <div class="mb-2 fw-medium">Variations</div>

                                <div class="row">
                                    <div class="col-4">
                                        <div class="mb-3">
                                            <label class="form-check-label size-option w-100">
                                                <input type="radio" class="form-check-input d-none" name="size" checked />
                                                <div class="size-box text-center">
                                                    <span class="me-2 fw-semibold">M -</span><br></br>
                                                    <small>Price: ₹550</small>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-4">
                                        <div class="mb-3">
                                            <label class="form-check-label size-option w-100">
                                                <input type="radio" class="form-check-input d-none" name="size" />
                                                <div class="size-box text-center">
                                                    <span class="me-2 fw-semibold">L -</span>  <br></br>
                                                    <small>Price: ₹550</small>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-4">
                                        <div class="mb-3">
                                            <label class="form-check-label size-option w-100">
                                                <input type="radio" class="form-check-input d-none" name="size" />
                                                <div class="size-box text-center">
                                                    <span class="me-2 fw-semibold">XL -</span><br></br>
                                                    <small>Price: ₹550</small>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="mb-3">
                                            <label class="form-check-label size-option w-100">
                                                <input type="radio" class="form-check-input d-none" name="price_type" checked />
                                                <div class="size-box text-center">
                                                    <span class="me-2">Sale Price</span>: ₹550
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-6">
                                        <div class="mb-3">
                                            <label class="form-check-label size-option w-100">
                                                <input type="radio" class="form-check-input d-none" name="price_type" />
                                                <div class="size-box text-center">
                                                    <span class="me-2">WSP</span>: ₹550
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>






                                <div class="row">

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Price



                                            </label>
                                            <input id="productname" name="productname"
                                                type="text" class="form-control" />
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Quantity



                                            </label>
                                            <input id="productname" name="productname"
                                                type="text" class="form-control" />
                                        </div>
                                    </div>
                                </div>



                                <div class="row">

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Discount Type





                                            </label>
                                            <select class="form-select">
                                                <option value="">Select</option>
                                                <option value="">Percentage</option>
                                                <option value="Beverages">Fixed</option>


                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label" for="productname">Discount



                                            </label>
                                            <input id="productname" name="productname"
                                                type="text" class="form-control" />
                                        </div>
                                    </div>







                                </div>













                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-success waves-effect" data-bs-dismiss="modal">Save</button>

                                <button type="button" class="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="myModalTwo" class="modal fade" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" data-bs-scroll="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="myModalLabel">Change Payment Status</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div>
                                <h5 class="font-size-14 py-2">Order ID : <span class="float-end fw-normal text-body">#214569</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Return Request ID : <span class="float-end fw-normal text-body">#214569</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Customer Name : <span class="float-end fw-normal text-body">Subramnai R</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Product Name : <span class="float-end fw-normal text-body">Coco Cola</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Reason for Return : <span class="float-end fw-normal text-body">Damaged</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">Current Status : <span class="float-end fw-normal text-body">Pending</span></h5>
                            </div>

                            <div>
                                <h5 class="font-size-14 py-2">New Status : <span class="float-end fw-normal text-body"><select class="form-select">
                                    <option selected="">Select Status</option>
                                    <option value="AE">Rejected </option>
                                    <option value="VI">Pending</option>
                                    <option value="MC">Accepted</option>
                                </select></span></h5>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>



            <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <form class="needs-validation" novalidate id="paymentForm">
                            <div class="modal-header bg-gradient" style={{ background: "linear-gradient(to right, #00b4db, #0083b0)" }} >
                                <h5 class="modal-title text-white" id="paymentModalLabel">Payments</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div class="modal-body d-flex gap-4 flex-wrap">

                                <div class="flex-grow-1">
                                    <div class="mb-3">
                                        <label for="payment-method" class="form-label fw-bold">Payment Method</label>
                                        <select id="payment-method" class="form-select bg-light" required>
                                            <option value="">Select Method</option>
                                            <option value="cash">Cash</option>
                                            <option value="upi">UPI</option>
                                            <option value="card">Card</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a payment method.</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="amount" class="form-label fw-bold">Amount</label>
                                        <input type="text" id="amount" class="form-control bg-light" placeholder="Enter amount" min="0.01" step="0.01" required />
                                        <div class="invalid-feedback">Please enter a valid amount.</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="paymentNote" class="form-label fw-bold">Payment Note</label>
                                        <textarea id="paymentNote" class="form-control bg-light" rows="4" placeholder="Enter payment note"></textarea>
                                    </div>
                                </div>

                                <div style={{ width: "200px", backgroundColor: "#D60117" }} class="text-white p-3 rounded">
                                    <p class="d-flex justify-content-between border-bottom pb-1">
                                        <span>Total Items:</span><span>1</span>
                                    </p>
                                    <p class="d-flex justify-content-between border-bottom pb-1">
                                        <span>Total:</span><span>660.00</span>
                                    </p>
                                    <p class="d-flex justify-content-between border-bottom pb-1">
                                        <span>Discount(-):</span><span>0.00</span>
                                    </p>
                                    <p class="d-flex justify-content-between border-bottom pb-1 bg-warning text-dark fw-bold p-2 rounded">
                                        <span>Total Payable:</span><span>660.00</span>
                                    </p>
                                    <p class="d-flex justify-content-between border-bottom pb-1">
                                        <span>Total Paying:</span><span>0.00</span>
                                    </p>
                                    <p class="d-flex justify-content-between border-bottom pb-1">
                                        <span>Balance:</span><span>660.00</span>
                                    </p>
                                    <p class="d-flex justify-content-between bg-warning text-dark fw-bold p-2 rounded">
                                        <span>Change Return:</span><span>0.00</span>
                                    </p>
                                </div>
                            </div>

                            <div class="modal-footer justify-content-between">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                                <div>
                                    <button type="submit" class="btn btn-danger me-2">Save</button>
                                    <button type="submit" class="btn btn-success"><i class="bi bi-printer me-1"></i> Save & Print</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>



        </div>





    );
};

export default PosList;