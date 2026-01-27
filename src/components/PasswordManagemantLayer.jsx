import React, { useState } from 'react';
import productApis from '../apiProvider/product';

export default function PasswordManagemantLayer() {
  const [email,setEmail]=useState([])
  const [newPassword,setnewPassword]=useState([])
  const [conformPassword,setconformPassword]=useState([])

  const handleSubmit=async(e)=>{
    e.preventDefault()
    console.log("submit")
    let input={
      userId:email,
      newPin:newPassword,
      conformPin:conformPassword
    }
    console.log(input,"input")
    const result = await productApis.changePassword(input);
    console.log(result,"result")
  }
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-5">
                    <div className="mt-4 mt-xl-0">
                      <form>
                        <div className="row mb-6">
                          <label htmlFor="email-input" className="col-sm-3 col-form-label">
                            User Email
                          </label>
                          <div className="col-sm-9">
                            <input
                              className="form-control"
                              type="email"
                              id="email-input"
                              onChange={(e)=>{setEmail(e.target.value)}}
                              value={email}
                            />
                          </div>
                        </div>
                        <div className="row mb-4">
                          <label htmlFor="new-password-input" className="col-sm-3 col-form-label">
                            New Password
                          </label>
                          <div className="col-sm-9">
                            <input
                              className="form-control"
                              type="password"
                              id="new-password-input"
                              onChange={(e)=>{setnewPassword(e.target.value)}}
                              value={newPassword}
                            />
                          </div>
                        </div>
                        <div className="row mb-4">
                          <label htmlFor="confirm-password-input" className="col-sm-3 col-form-label">
                            Confirm New Password
                          </label>
                          <div className="col-sm-9">
                            <input
                              className="form-control"
                              type="password"
                              id="confirm-password-input"
                              onChange={(e)=>{setconformPassword(e.target.value)}}
                              value={conformPassword}
                            />
                          </div>
                        </div>
                        <div className="row justify-content-end">
                          <div className="col-sm-9">
                            <button type="submit" className="btn btn-success w-md" onClick={(e)=>handleSubmit(e)}>
                              Generate
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> {/* end row */}
              </div>
            </div>
          </div>
        </div> {/* end form layout row */}
      </div> {/* container-fluid */}
    </div>
  );
}
