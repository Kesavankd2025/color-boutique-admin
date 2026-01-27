import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';


const ReportPayment = () => {

    const [ errors, setErrors ] = useState({});
    const [formData, setFormData] = useState({
        customerName: '',
        orderId: '',
        paymentMethod: '',
        paymentDate: '',
        amountPaid:'',
        referenceNumber:'',
        remarks : '',

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

        if(!formData.customerName) {
            newErrors.customerName = 'Customer Name is Required'
        }
        if(!formData.orderId) {
            newErrors.orderId = 'Order Id is Required'
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(Validate()){

            console.log("Record Manual Payment :", formData)
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
                                        <label className='form-label'>Customer/Wholesaler Name</label>
                                        <div className='position-relative'>
                                            <select
                                                className="form-select"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}

                                            >
                                                <option value="">Select</option>
                                                <option value="Anbarasan">Anbarasan</option>
                                                <option value="ArunKumar">ArunKumar</option>
                                                <option value="Deepan">Deepan</option>

                                            </select>
                                            {errors.customerName && <div className="text-danger">{errors.customerName}</div>}
                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label className='form-label'>
                                            Order ID</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'
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
                                            Payment Method</label>
                                        <select class="form-select" name="paymentMethod" onChange={handleChange} >
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

                                    <div className='col-sm-6'>
                                        <label className="form-label">Payment Date</label>
                                        <div className='position-relative'>
                                            <input
                                                className="form-control form-control-sm"
                                                name="paymentDate"
                                                type="date"
                                                value={formData.paymentDate}
                                                onChange={handleChange}

                                            />
                                        </div>

                                    </div>



                                    <div className='col-sm-6'>
                                        <label className='form-label'>Amount Paid</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'
                                                required
                                                name="amountPaid"
                                                value={formData.amountPaid}
                                                onChange={handleChange}

                                            />
                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>

                                    <div className='col-sm-6'>
                                        <label className='form-label'>Reference Number</label>
                                        <div className='position-relative'>
                                            <input
                                                inputMode='none'
                                                type='text'
                                                className='form-control wizard-required'
                                                required=''
                                                name="referenceNumber"
                                                value={formData.referenceNumber}
                                                onChange={handleChange}

                                            />
                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label className='form-label'>Remarks</label>
                                        <div className='position-relative'>
                                            <input
                                                type='text'
                                                className='form-control wizard-required'

                                                required
                                                name="remarks"
                                                value={formData.remarks}
                                                onChange={handleChange}

                                            />
                                            {/* {errors.price && <div className="text-danger">{errors.price}</div>} */}

                                            <div className='wizard-form-error' />
                                        </div>
                                    </div>


                                    <div className='form-group text-end'>
                                        <button

                                            type='button'
                                            className='form-wizard-next-btn btn btn-danger me-1 px-32'
                                        >
                                            Cancel
                                        </button>
                                        <button

                                            type='button'
                                            className='form-wizard-next-btn btn btn-success px-32'
                                            onClick={handleSubmit}
                                        >
                                            Confirm Payment
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

export default ReportPayment;