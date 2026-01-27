import React, { useState } from 'react';
import { PlusCircle } from '@phosphor-icons/react';

export default function RepackingOrderListLayer() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        product: '',
        batch: '',
        bulkQty: '',
        repackQty: '',
        packSize: '',
        estimatedPacks: '',
        staff: '',
    });
    const [viewOrder, setViewOrder] = useState(null);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted data:', formData);
        setShowModal(false);
    };

    const orders = [
        {
            id: '#RS885521',
            product: 'Jam Bun',
            batch: 'BTCH202501',
            bulkQty: 5000,
            packedQty: 4800,
            wastage: 200,
            status: 'Completed',
            statusClass: 'bg-success-subtle text-success',
            staff: 'Susee',
        },
        {
            id: '#RS885522',
            product: 'Chocolate Cake',
            batch: 'BTCH202502',
            bulkQty: 4500,
            packedQty: 4300,
            wastage: 200,
            status: 'Pending',
            statusClass: 'bg-danger-subtle text-danger',
            staff: 'Uma',
        },
        {
            id: '#RS885523',
            product: 'Vanilla Ice Cream',
            batch: 'BTCH202503',
            bulkQty: 6000,
            packedQty: 5800,
            wastage: 200,
            status: 'Inprocess',
            statusClass: 'bg-warning-subtle text-warning',
            staff: 'Mira',
        },
        {
            id: '#RS885524',
            product: 'Mango Juice',
            batch: 'BTCH202504',
            bulkQty: 5500,
            packedQty: 5400,
            wastage: 100,
            status: 'Completed',
            statusClass: 'bg-success-subtle text-success',
            staff: 'Reena',
        },
    ];

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="card-title me-2">Repacking Order List</h5>
                                    <div className="ms-auto">
                                        <button
                                            type="button"
                                            className="btn btn-success d-inline-flex justify-content-center align-items-center"
                                            onClick={() => setShowModal(true)}
                                        >
                                            <PlusCircle size={18} weight="fill" className="me-2" />
                                            Repacking
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="mx-n4 simplebar-scrollable-y"
                                    data-simplebar="init"
                                    style={{ maxHeight: '332px' }}
                                >
                                    <div className="table-responsive">
                                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Repacking ID</th>
                                                    <th>Product Name</th>
                                                    <th>Batch Number</th>
                                                    <th>Total Bulk Quantity</th>
                                                    <th>Total Packed Quantity</th>
                                                    <th>Total Wastage</th>
                                                    <th>Repacking Status</th>
                                                    <th>Assigned Staff</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order, index) => (
                                                    <tr key={order.id}>
                                                        <td>{index + 1}.</td>
                                                        <td>{order.id}</td>
                                                        <td style={{ width: '190px' }}>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-grow-1 ms-3">{order.product}</div>
                                                            </div>
                                                        </td>
                                                        <td>{order.batch}</td>
                                                        <td>{order.bulkQty}</td>
                                                        <td>{order.packedQty}</td>
                                                        <td>{order.wastage}</td>
                                                        <td>
                                                            <span className={`badge badge-pill ${order.statusClass} font-size-12`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>{order.staff}</td>
                                                        <td>
                                                            <ul className="list-inline mb-0">
                                                                <li className="list-inline-item dropdown">
                                                                    <a
                                                                        className="text-muted dropdown-toggle font-size-18 px-2"
                                                                        href="#"
                                                                        role="button"
                                                                        data-bs-toggle="dropdown"
                                                                    >
                                                                        <i className="bx bx-dots-vertical-rounded"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button className="dropdown-item" onClick={() => setViewOrder(order)}>View</button>
                                                                        <button className="dropdown-item" onClick={() => setShowModal(true)}>Edit</button>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {viewOrder && (
                                    <div
                                        className="modal fade show"
                                        tabIndex="-1"
                                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                        aria-modal="true"
                                        role="dialog"
                                    >
                                        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Repacking Details</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        aria-label="Close"
                                                        onClick={() => setViewOrder(null)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body p-4">
                                                    <div className="card-body">
                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Product Name:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.product}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Batch Number:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.batch}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Bulk Quantity Available:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.bulkQty}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Repacking Quantity:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.packedQty}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Target Pack Size:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.packSize}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Estimated No. of Packs:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.estimatedPacks}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3 row">
                                                            <div className="col-md-6">
                                                                <h5 className="font-size-14 py-2">Assigned Staff:</h5>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <span className="float-end fw-normal text-body">
                                                                    {viewOrder.staff}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary waves-effect"
                                                        onClick={() => setViewOrder(null)}
                                                    >
                                                        Close
                                                    </button>
                                                    <button type="button" className="btn btn-primary waves-effect waves-light">
                                                        Save changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {/* Modal Component */}
                                {showModal && (
                                    <div className="modal fade show d-block" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Create Repacking Request</h5>
                                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                                </div>
                                                <div className="modal-body p-4">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-3">
                                                                <label className="form-label">Product Name</label>
                                                                <select className="form-select" name="product" value={formData.product} onChange={handleInputChange}>
                                                                    <option value="">Select</option>
                                                                    <option value="Jam Bun">Jam Bun</option>
                                                                    <option value="Chocolate Cake">Chocolate Cake</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-6 mb-3">
                                                                <label className="form-label">Batch Number</label>
                                                                <input type="text" className="form-control" name="batch" value={formData.batch} onChange={handleInputChange} />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-3">
                                                                <label className="form-label">Bulk Quantity Available</label>
                                                                <input type="number" className="form-control" name="bulkQty" value={formData.bulkQty} onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-6 mb-3">
                                                                <label className="form-label">Repacking Quantity</label>
                                                                <input type="number" className="form-control" name="repackQty" value={formData.repackQty} onChange={handleInputChange} />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-4 mb-3">
                                                                <label className="form-label">Target Pack Size</label>
                                                                <select className="form-select" name="packSize" value={formData.packSize} onChange={handleInputChange}>
                                                                    <option value="">Select</option>
                                                                    <option value="100g">100g</option>
                                                                    <option value="500g">500g</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <label className="form-label">Estimated No. of Packs</label>
                                                                <input type="number" className="form-control" name="estimatedPacks" value={formData.estimatedPacks} onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <label className="form-label">Assigned Staff</label>
                                                                <select className="form-select" name="staff" value={formData.staff} onChange={handleInputChange}>
                                                                    <option value="">Select</option>
                                                                    <option value="Susee">Susee</option>
                                                                    <option value="Uma">Uma</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="submit" className="btn btn-success" onClick={handleSubmit}>
                                                        Save
                                                    </button>
                                                    <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* End Modal */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
