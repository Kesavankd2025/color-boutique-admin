// import { PlusCircle } from '@phosphor-icons/react';
// import React, { useState } from 'react';

// export default function DeleveryPersonListLayer() {
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '', 
//     vehicle: '',
//     license: '',
//     zone: '',
//     maxOrders: '',
//   });

//   const deliveryPersons = [
//     {
//       id: '#562351',
//       name: 'Anbu',
//       phone: '9176169660',
//       email: 'edwinjagob@gmail.com',
//       vehicle: 'Bike',
//       assigned: 80,
//       completed: 52,
//       failed: 8,
//       status: 'Active',
//       statusClass: 'btn-subtle-success',
//       license: 'TN 38 AB 1234',
//       zone: 'Coimbatore & Nearby Areas',
//       maxOrders: 15,
//     },
//     // Add more persons...
//   ];

//   const handleEdit = (person) => {
//     setSelectedPerson(person);
//     setFormData({
//       name: person.name,
//       phone: person.phone,
//       email: person.email,
//       vehicle: person.vehicle,
//       license: person.license || '',
//       zone: person.zone || '',
//       maxOrders: person.maxOrders || '',
//     });
//   };

//   const handleView = (person) => {
//     setSelectedPerson(person);
//     setShowViewModal(true);
//   };

//   const handleAddNew = () => {
//     setSelectedPerson(null);
//     setFormData({
//       name: '',
//       phone: '',
//       email: '',
//       vehicle: '',
//       license: '',
//       zone: '',
//       maxOrders: '',
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const closeViewModal = () => {
//     setShowViewModal(false);
//     setSelectedPerson(null);
//   };

//   return (
//     <div className="page-content">
//       <div className="container-fluid">

//         {/* Header */}
//         <div className="row">
//           <div className="col-xxl-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="d-flex flex-wrap align-items-center mb-3">
//                   <h5 className="card-title me-2">Delivery Person List</h5>
//                   <div className="ms-auto">
//                     <button
//                       type="button"
//                       className="btn btn-success d-inline-flex align-items-center waves-effect waves-light"
//                       data-bs-toggle="modal"
//                       data-bs-target="#addInvoiceModalone"
//                       onClick={handleAddNew}
//                     >
//                       <PlusCircle size={18} weight="fill" className="me-2" />
//                       Delivery Person
//                     </button>
//                   </div>
//                 </div>

//                 {/* Table */}
//                 <div className="table-responsive" style={{ maxHeight: '332px', overflowY: 'auto' }}>
//                   <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
//                     <thead>
//                       <tr>
//                         <th>S.No</th>
//                         <th>ID</th>
//                         <th>Full Name</th>
//                         <th>Phone</th>
//                         <th>Email</th>
//                         <th>Vehicle</th>
//                         <th>Assigned</th>
//                         <th>Completed</th>
//                         <th>Failed</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {deliveryPersons.map((person, idx) => (
//                         <tr key={idx}>
//                           <td>{idx + 1}.</td>
//                           <td>{person.id}</td>
//                           <td className="text-center">{person.name}</td>
//                           <td className="text-center">{person.phone}</td>
//                           <td className="text-center">{person.email}</td>
//                           <td className="text-center">{person.vehicle}</td>
//                           <td className="text-center">{person.assigned}</td>
//                           <td className="text-center">{person.completed}</td>
//                           <td className="text-center">{person.failed}</td>
//                           <td>
//                             <button type="button" className={`btn ${person.statusClass} btn-sm`}>
//                               {person.status}
//                             </button>
//                           </td>
//                           <td>
//                             <ul className="list-inline mb-0">
//                               <li className="list-inline-item dropdown">
//                                 <a className="text-muted dropdown-toggle font-size-18 px-2" href="#" data-bs-toggle="dropdown">
//                                   <i className="bx bx-dots-vertical-rounded"></i>
//                                 </a>
//                                 <div className="dropdown-menu dropdown-menu-end">
//                                   <button className="dropdown-item" onClick={() => handleView(person)}>View</button>
//                                   <button
//                                     className="dropdown-item"
//                                     data-bs-toggle="modal"
//                                     data-bs-target="#addInvoiceModalone"
//                                     onClick={() => handleEdit(person)}
//                                   >
//                                     Edit
//                                   </button>
//                                 </div>
//                               </li>
//                             </ul>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* View Modal */}
//         {showViewModal && selectedPerson && (
//           <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//             <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Delivery Person Details</h5>
//                   <button type="button" className="btn-close" onClick={closeViewModal}></button>
//                 </div>
//                 <div className="modal-body p-4">
//                   <div className="card-body">
//                     {[
//                       ['Full Name', selectedPerson.name],
//                       ['Phone Number', selectedPerson.phone],
//                       ['Email Address', selectedPerson.email],
//                       ['Vehicle Type', selectedPerson.vehicle],
//                       ['License Number', selectedPerson.license || 'N/A'],
//                       ['Preferred Delivery Areas', selectedPerson.zone || 'N/A'],
//                       ['Maximum Orders Per Day', selectedPerson.maxOrders || 'N/A'],
//                     ].map(([label, value], i) => (
//                       <div className="mb-3 row" key={i}>
//                         <div className="col-md-6">
//                           <h5 className="font-size-14 py-2">{label}:</h5>
//                         </div>
//                         <div className="col-md-6">
//                           <span className="float-end fw-normal text-body">{value}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={closeViewModal}>
//                     Close
//                   </button>
//                   <button type="button" className="btn btn-primary" >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit/Add Modal */}
//         <div className="modal fade" id="addInvoiceModalone" tabIndex="-1" aria-hidden="true">
//           <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {selectedPerson ? 'Edit Delivery Person' : 'Add Delivery Person'}
//                 </h5>
//                 <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//               </div>
//               <div className="modal-body p-4">
//                 <form>
//                   <div className="row">
//                     {[
//                       ['Full Name', 'name', 'text'],
//                       ['Phone Number', 'phone', 'tel'],
//                       ['Email', 'email', 'email'],
//                       ['License Number', 'license', 'text'],
//                       ['Max Orders Per Day', 'maxOrders', 'number'],
//                     ].map(([label, name, type]) => (
//                       <div className="col-lg-6 mb-3" key={name}>
//                         <label className="form-label">{label}</label>
//                         <input type={type} className="form-control" name={name} value={formData[name]} onChange={handleInputChange} />
//                       </div>
//                     ))}

//                     <div className="col-lg-6 mb-3">
//                       <label className="form-label">Vehicle Type</label>
//                       <select className="form-select" name="vehicle" value={formData.vehicle} onChange={handleInputChange}>
//                         <option value="">Select</option>
//                         <option value="Bike">Bike</option>
//                         <option value="Van">Van</option>
//                         <option value="Truck">Truck</option>
//                       </select>
//                     </div>

//                     <div className="col-lg-6 mb-3">
//                       <label className="form-label">Preferred Delivery Areas</label>
//                       <select className="form-select" name="zone" value={formData.zone} onChange={handleInputChange}>
//                         <option value="">Select</option>
//                         <option value="Coimbatore & Nearby Areas">Coimbatore & Nearby Areas</option>
//                         <option value="Zone A">Zone A</option>
//                         <option value="Zone B">Zone B</option>
//                       </select>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-success" data-bs-dismiss="modal">
//                   Save
//                 </button>
//                 <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
import { Icon } from '@iconify/react';
import { PlusCircle } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import apiProvider from '../apiProvider/adminuserapi';

const DeleveryPersonListLayer = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
    confirmPassword: '',
    status: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const input = {
        role: 'Delivery'
      }
      const result = await apiProvider.getUserList(input);

      console.log("Fetched Category Response:", result.response);

      if (result && result.status) {
        const items = result.response?.data || [];
        setUsers(items);
        console.log('setusers :', items)
      } else {
        if (result && result.response?.message === "Invalid token") {
          console.warn("Token invalid. Redirecting to login...");
          // localStorage.removeItem("authToken");
          // window.location.href = "/login";
          return;
        }

        console.error("Failed to fetch categories. Result is invalid or missing expected response:", result);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);

      if (error.response) {
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Data:", error.response.data);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const updatedUser = {
        ...user,
        isDelete: true,
        password: user.password || "dummy-password",
      };

      console.log("updatedUser:", updatedUser);

      const response = await apiProvider.deleteUser(user._id, updatedUser);
      console.log("response:", response);

      if (response && response.status === 200) {
        toast.success("User marked as deleted successfully");
        fetchData();
        // Optionally refresh user list or update UI
      } else {
        toast.error("Failed to mark user as deleted");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Error occurred while marking user as deleted");
    }
  };



  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xxl-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center mb-3">
                  <h5 className="card-title me-2">User List</h5>
                </div>

                <div className="table-responsive" style={{ maxHeight: 332, overflowY: 'auto' }}>
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>phone Number</th>
                        {/* <th>Role</th> */}
                        <th>Status</th>
                        {/* <th>Last Login</th> */}
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}.</td>
                          <td>{user.userId}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber}</td>
                          {/* <td>{user.role}</td> */}
                          <td>
                            <button
                              className={`btn btn-sm ${user.isActive === true || user.isActive === 'true' ? 'btn-success' : 'btn-danger'}`}
                            >
                              {user.isActive === true || user.isActive === 'true' ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          {/* <td>{user.lastLogin}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-light dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <Icon icon="mdi:dots-horizontal" />
                              </button>
                              <ul className="dropdown-menu shadow rounded-2 p-2">
                                <li>
                                  <button
                                    className="dropdown-item px-3 py-2 text-sm text-start"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    View
                                  </button>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item px-3 py-2 text-sm text-start"
                                    to="/create-user"
                                    state={{ editUser: user }}
                                  >
                                    Edit
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item px-3 py-2 text-sm text-danger text-start"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>

                            </div>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Toast Container */}
                <ToastContainer />

                {/* View User Modal */}
                {selectedUser && (
                  <div
                    className="modal fade show"
                    id="addInvoiceModal"
                    tabIndex="-1"
                    aria-labelledby="addInvoiceModalLabel"
                    aria-modal="true"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="addInvoiceModalLabel">User Details</h5>
                          <button type="button" className="btn-close" onClick={() => setSelectedUser(null)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                          <div className="card-body">

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">User ID:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.userId || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">Full Name:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.name}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">Email Address:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.email}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">PhoneNumber :</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.phoneNumber}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">Role:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.role}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">Status:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>

                            <div className="mb-3 row">
                              <div className="col-md-6">
                                <h5 className="font-size-14 py-2">Last Login:</h5>
                              </div>
                              <div className="col-md-6">
                                <span className="fw-normal text-body">{selectedUser.lastLogin}</span>
                              </div>
                            </div>

                          </div>

                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary waves-effect" onClick={() => setSelectedUser(null)}>Close</button>
                            {/* <button type="button" className="btn btn-primary waves-effect waves-light">Save changes</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleveryPersonListLayer;

