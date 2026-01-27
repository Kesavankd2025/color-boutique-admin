import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';


const ProcessRefund = () => {

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        orderId: '',
        transactionId: '',
        customerName: '',
        refundAmount: '',
        refundMethod: '',
        refundReason: '',

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const Validate = () => {
        const newErrors = {};

        if (!formData.orderId) {
            newErrors.orderId = "Order Id is Required"
        }

        if (!formData.transactionId) {
            newErrors.transactionId = "Transaction Id is Required"
        }

        if (!formData.customerName) {
            newErrors.customerName = "Customer Name is Required"
        }

        if (!formData.refundAmount) {
            newErrors.refundAmount = "Refund Amount is Required"
        }

        if (!formData.refundMethod) {
            newErrors.refundMethod = "Refund Method is Required"
        }

        if (!formData.refundReason) {
            newErrors.refundReason = "Refund Reason is Required"
        }

        
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Validate()) {

            console.log("process Refund :", formData)
        }
    }

    return (

        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <div className='col-md-12'>
                    <div className='card-body'>

                        {/* Form Wizard Start */}
                        <div className='form-wizard'>
                            <div >
                                <div className='row gy-3'>


                                    <div className='col-sm-6'>
                                        <label className='form-label'>
                                            Order ID</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'
                                                // placeholder='Type to Search..'
                                                required
                                                name="orderId"
                                                value={formData.orderId}
                                                onChange={handleChange}

                                            />
                                            {errors.orderId && <div className="text-danger">{errors.orderId}</div>}

                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>


                                    <div className='col-sm-6'>
                                        <label className='form-label'>
                                            Transaction ID</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'

                                                required=''
                                                name="transactionId"
                                                value={formData.transactionId}
                                                onChange={handleChange}

                                            />
                                            {errors.transactionId && <div className="text-danger">{errors.transactionId}</div>}

                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>



                                    <div className='col-sm-6'>
                                        <label className='form-label'>Customer/Wholesaler Name</label>
                                        <div className='position-relative'>
                                            <select
                                                className="form-select"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}

                                            >
                                                <option value="">Select Person</option>
                                                <option value="Anbarasan">Anbarasan</option>
                                                <option value="ArunKumar">ArunKumar</option>
                                                <option value="Deepan">Deepan</option>


                                            </select>
                                            {errors.customerName && <div className="text-danger">{errors.customerName}</div>}
                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>



                                    <div className='col-sm-6'>
                                        <label className='form-label'>Refund Amount</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'
                                                required
                                                name="refundAmount"
                                                value={formData.refundAmount}
                                                onChange={handleChange}

                                            />
                                            {errors.refundAmount && <div className='text-danger'>{errors.refundAmount}</div>}
                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>


                                    <div className='col-sm-6'>
                                        <label className='form-label'>
                                            Refund Method</label>
                                        <select class="form-select" name="refundMethod" value={formData.refundMethod} onChange={handleChange}>
                                            <option value="">Select Refund Method</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="upi">UPI</option>
                                            <option value="wallet">Wallet</option>
                                            <option value="credit_account">Credit Adjustment</option>
                                        </select>
                                        {errors.refundMethod && <div className='text-danger'>{errors.refundMethod}</div>}

                                    </div>



                                    <div className='col-sm-6'>
                                        <label className='form-label'>
                                            Refund Reason</label>
                                        <select class="form-select" name="refundReason" value={formData.refundReason} onChange={handleChange} >
                                            <option value="">Select Option</option>
                                            <option value="bank_transfer">Order Cancellation</option>
                                            <option value="upi">Product Return</option>
                                            <option value="wallet">Other</option>

                                        </select>
                                        {errors.refundReason && <div className='text-danger'>{errors.refundReason}</div>}

                                    </div>

                                    <div className='form-group text-end'>
                                        <button

                                            type='ffff'
                                            className='form-wizard-next-btn btn btn-danger me-1 px-32'
                                        >
                                            Cancel
                                        </button>
                                        <button

                                            type='ffff'
                                            className='form-wizard-next-btn btn btn-success px-32'
                                            onClick={handleSubmit}
                                        >
                                            Confirm Refund
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>
                        {/* Form Wizard End */}
                    </div>
                </div>
            </div>


        </div>


    );
};

export default ProcessRefund;