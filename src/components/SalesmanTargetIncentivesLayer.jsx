import React, { useState, useEffect } from 'react';
import salesApi from '../apiProvider/salesapi';
import apiProvider from '../apiProvider/adminuserapi';

const SalesmanTargetIncentive = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        salemanId: '',
        targetSalesAmount: '',
        targetPeriod: '',
        incentiveAmount: '',
        status: 'Not Achieved',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const input = { role: 'Salesman' };
            const result = await apiProvider.getUserList(input);
            if (result && result.status) {
                const items = result.response?.data || [];
                setUsers(items);
            } else {
                setUsers([]);
            }
        } catch (error) {
            setUsers([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.salemanId) newErrors.salemanId = 'Salesman is required';
        if (!form.targetSalesAmount || isNaN(form.targetSalesAmount)) newErrors.targetSalesAmount = 'Valid target sales amount is required';
        if (!form.targetPeriod) newErrors.targetPeriod = 'Target period is required';
        if (!form.incentiveAmount || isNaN(form.incentiveAmount)) newErrors.incentiveAmount = 'Valid incentive amount is required';
        if (!form.status) newErrors.status = 'Status is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        setSubmitting(true);
        try {
            const payload = {
                salemanId: form.salemanId,
                targetSalesAmount: Number(form.targetSalesAmount),
                targetPeriod: form.targetPeriod,
                incentiveAmount: Number(form.incentiveAmount),
                status: form.status,
            };
            const res = await salesApi.createSalesTarget(payload);
            if (res.status) {
                setSuccessMsg('Salesman target created successfully!');
                setForm({ salemanId: '', targetSalesAmount: '', targetPeriod: '', incentiveAmount: '', status: 'Not Achieved' });
            } else {
                setErrorMsg(res.response?.message || 'Failed to create target');
            }
        } catch (err) {
            setErrorMsg('Failed to create target');
        }
        setSubmitting(false);
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card p-4" style={{ maxWidth: 500, width: '100%' }}>
                <h4 className="mb-4 text-center">Salesman Target Incentive</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Salesman Name <span className="text-danger">*</span></label>
                        <select className="form-select" name="salemanId" value={form.salemanId} onChange={handleChange} required>
                            <option value="">Select Salesman</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.name || user.fullName}</option>
                            ))}
                        </select>
                        {errors.salemanId && <div className="text-danger small">{errors.salemanId}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Target Sales Amount <span className="text-danger">*</span></label>
                        <input className="form-control" type="number" name="targetSalesAmount" value={form.targetSalesAmount} onChange={handleChange} required min="0" />
                        {errors.targetSalesAmount && <div className="text-danger small">{errors.targetSalesAmount}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Target Period <span className="text-danger">*</span></label>
                        <select className="form-select" name="targetPeriod" value={form.targetPeriod} onChange={handleChange} required>
                            <option value="">Select Period</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                        {errors.targetPeriod && <div className="text-danger small">{errors.targetPeriod}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Incentive Amount <span className="text-danger">*</span></label>
                        <input className="form-control" type="number" name="incentiveAmount" value={form.incentiveAmount} onChange={handleChange} required min="0" />
                        {errors.incentiveAmount && <div className="text-danger small">{errors.incentiveAmount}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status <span className="text-danger">*</span></label>
                        <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
                            <option value="Not Achieved">Not Achieved</option>
                            <option value="Achieved">Achieved</option>
                        </select>
                        {errors.status && <div className="text-danger small">{errors.status}</div>}
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary px-5" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                    </div>
                    {successMsg && <div className="alert alert-success mt-2">{successMsg}</div>}
                    {errorMsg && <div className="alert alert-danger mt-2">{errorMsg}</div>}
                </form>
            </div>
        </div>
    );
};

export default SalesmanTargetIncentive;