import React from 'react'

export default function ResetPasswordLayer() {
    return (
        <div className="authentication-bg min-vh-100">
            <div className="bg-overlay bg-light"></div>
            <div className="container">
                <div className="d-flex flex-column min-vh-100 px-3 pt-4">
                    <div className="row justify-content-center my-auto">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="mb-4 pb-2">
                                <a href="index" className="d-block d-flex justify-content-center auth-logo">
                                    <img
                                        src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/nalsuvai-logo.png"
                                        alt=""
                                        height="100"
                                        className="auth-logo-dark me-start"
                                    />
                                    {/* <img
                                        src="https://taslim.oceansoftwares.in/nalsuvai/public/build/images/nalsuvai-logo.png"
                                        alt=""
                                        height="100"
                                        className="auth-logo-light me-start"
                                    /> */}
                                </a>
                            </div>

                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="text-center mt-2">
                                        <h5>Reset Password</h5>
                                        <p className="text-muted">Reset Password with Nalsuvai.</p>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <div
                                            className="alert alert-success text-center small mb-4"
                                            role="alert"
                                        >
                                            Enter your Email and instructions will be sent to you!
                                        </div>

                                        <form
                                            method="POST"
                                            action="https://taslim.oceansoftwares.in/nalsuvai/public/password/email"
                                            className="auth-input"
                                        >
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value="RF9J4sO7hfrP04eh2t2ZGNhw8bCPtk3ZVYwBWvT4"
                                                autoComplete="off"
                                            />
                                            <div className="mb-2">
                                                <label htmlFor="email" className="form-label">
                                                    Email <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    required
                                                    autoComplete="email"
                                                    autoFocus
                                                    placeholder="Enter Email"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <button className="btn btn-primary w-100" type="submit">
                                                    Reset
                                                </button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p className="mb-0">
                                                    Remember It ?{' '}
                                                    <a
                                                        href="/"
                                                        className="fw-medium text-primary"
                                                    >
                                                        {' '}
                                                        Sign in{' '}
                                                    </a>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center p-4">
                                <p>
                                    © {new Date().getFullYear()} 2025 Nalsuvai. All Rights
                                    Reserved. Developed &amp; Maintained By Ocean Softwares
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
