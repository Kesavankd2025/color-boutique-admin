import React, { useState } from 'react';
import "./styles/createOrderListLayer.css"

export default function CreateOrderListLayer() {
    const [activeAccordion, setActiveAccordion] = useState('customer');

    const toggleAccordion = (accordion) => {
        setActiveAccordion(activeAccordion === accordion ? null : accordion);
    };

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-lg-12">
                    <div id="addproduct-accordion" className="custom-accordion">
                        {/* Customer Details */}
                        <div className="card mb-6">
                            <div
                                className="text-body cursor-pointer"
                                onClick={() => toggleAccordion('customer')}
                                aria-expanded={activeAccordion === 'customer'}
                            >
                                <div className="p-16">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar">
                                                <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                    <h5 className="text-primary font-size-17 mb-0">01</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 custom-title overflow-hidden">
                                            <h5 className="font-size-16 mb-1">Customer Details</h5>
                                            <p className="text-muted text-truncate mb-0">Fill all information below</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <i className={`mdi accor-down-icon font-size-24 ${activeAccordion === 'customer' ? "mdi-chevron-up" : "mdi-chevron-down"}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeAccordion === 'customer' && (
                                <div className="p-16 border-top">
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="customerName">Customer Name</label>
                                                    <input id="customerName" name="customerName" type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="customerContact">Customer Contact</label>
                                                    <input id="customerContact" name="customerContact" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="deliveryAddress">Delivery Address</label>
                                                    <input id="deliveryAddress" name="deliveryAddress" type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="orderNotes">Order Notes</label>
                                                    <input id="orderNotes" name="orderNotes" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="card mb-6">
                            <div
                                className="text-body cursor-pointer"
                                onClick={() => toggleAccordion('product')}
                                aria-expanded={activeAccordion === 'product'}
                            >
                                <div className="p-16">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar">
                                                <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                    <h5 className="text-primary font-size-17 mb-0">02</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 custom-title overflow-hidden">
                                            <h5 className="font-size-16 mb-1">Product Details</h5>
                                            <p className="text-muted text-truncate mb-0">Fill all information below</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <i className={`mdi accor-down-icon font-size-24 ${activeAccordion === 'product' ? "mdi-chevron-up" : "mdi-chevron-down"}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeAccordion === 'product' && (
                                <div className="p-16 border-top">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="productNameSelect" className="form-label">Product Name</label>
                                                    <select id="productNameSelect" className="form-select">
                                                        <option value="">Select</option>
                                                        <option value="FI">Cold-Pressed Groundnut Oil 1L Bottle</option>
                                                        <option value="FA">Organic Turmeric Powder 200g Pack</option>
                                                        <option value="EL">Premium Basmati Rice 5kg Pack</option>
                                                        <option value="WW">Whole Wheat Atta 5kg Pack</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="productId">Product ID</label>
                                                    <input id="productId" name="productId" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="quantity">Quantity</label>
                                                    <input id="quantity" name="quantity" type="text" className="form-control" />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="unitPrice">Unit Price</label>
                                                    <input id="unitPrice" name="unitPrice" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="discount">Discount Applied</label>
                                                    <input id="discount" name="discount" type="text" className="form-control" />
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="totalPrice">Total Price</label>
                                                    <input id="totalPrice" name="totalPrice" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="stockLocation">Stock Location</label>
                                                    <select id="stockLocation" className="form-select">
                                                        <option value="">Select Location</option>
                                                        <option value="WH">Warehouse</option>
                                                        <option value="RS">Retail Store</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Payment Details */}
                        <div className="card mb-6">
                            <div
                                className="text-body cursor-pointer"
                                onClick={() => toggleAccordion('payment')}
                                aria-expanded={activeAccordion === 'payment'}
                            >
                                <div className="p-16">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar">
                                                <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                    <h5 className="text-primary font-size-17 mb-0">03</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 custom-title overflow-hidden">
                                            <h5 className="font-size-16 mb-1">Payment Details</h5>
                                            <p className="text-muted text-truncate mb-0">Fill all information below</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <i className={`mdi accor-down-icon font-size-24 ${activeAccordion === 'payment' ? "mdi-chevron-up" : "mdi-chevron-down"}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeAccordion === 'payment' && (
                                <div className="p-16 border-top">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="paymentMode" className="form-label">Payment Mode</label>
                                                    <select id="paymentMode" className="form-select">
                                                        <option>Select Payment Method</option>
                                                        <option value="cash">Cash</option>
                                                        <option value="creditCard">Credit Card</option>
                                                        <option value="debitCard">Debit Card</option>
                                                        <option value="upi">UPI</option>
                                                        <option value="wallet">Wallet</option>
                                                        <option value="credit">Credit</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                                                    <select id="paymentStatus" className="form-select">
                                                        <option>Select Status</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="unpaid">Unpaid</option>
                                                        <option value="partiallyPaid">Partially Paid</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Delivery Details */}
                        <div className="card mb-6">
                            <div
                                className="text-body cursor-pointer"
                                onClick={() => toggleAccordion('delivery')}
                                aria-expanded={activeAccordion === 'delivery'}
                            >
                                <div className="p-16">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar">
                                                <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                    <h5 className="text-primary font-size-17 mb-0">04</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 custom-title overflow-hidden">
                                            <h5 className="font-size-16 mb-1">Delivery Details</h5>
                                            <p className="text-muted text-truncate mb-0">Fill all information below</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <i className={`mdi accor-down-icon font-size-24 ${activeAccordion === 'delivery' ? "mdi-chevron-up" : "mdi-chevron-down"}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeAccordion === 'delivery' && (
                                <div className="p-16 border-top">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="deliveryType" className="form-label">Delivery Type</label>
                                                    <select id="deliveryType" className="form-select">
                                                        <option>Select Type</option>
                                                        <option value="standard">Standard</option>
                                                        <option value="express">Express</option>
                                                        <option value="scheduled">Scheduled</option>
                                                        <option value="sameDay">Same Day</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="deliveryPerson" className="form-label">Assigned Delivery Person</label>
                                                    <select id="deliveryPerson" className="form-select">
                                                        <option>Select Person</option>
                                                        <option value="ramkumar">Ramkumar</option>
                                                        <option value="dhanush">Dhanush</option>
                                                        <option value="krishnan">Krishnan</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label htmlFor="estimatedDate" className="form-label">Estimated Delivery Date</label>
                                                    <input type="datetime-local" id="estimatedDate" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label htmlFor="actualDate" className="form-label">Actual Delivery Date</label>
                                                    <input type="datetime-local" id="actualDate" className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label htmlFor="deliveryStatus" className="form-label">Delivery Status</label>
                                                    <select id="deliveryStatus" className="form-select">
                                                        <option>Select Status</option>
                                                        <option value="assigned">Assigned</option>
                                                        <option value="notAssigned">Not Assigned</option>
                                                        <option value="inTransit">In Transit</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="failed">Failed</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label htmlFor="deliveryNotes" className="form-label">Delivery Notes</label>
                                                    <input type="text" id="deliveryNotes" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col text-end">
                    <a href="#" className="btn btn-danger m-2"> <i className="bx bx-x me-1"></i> Cancel </a>
                    <a href="#" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#success-btn"> <i className=" bx bx-file me-1"></i> Save </a>
                </div>
            </div>
        </div>
    );
}