import React from 'react';

const RegisterForm = () => {
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
                    <h5>Register Account</h5>
                    <p className="text-muted">Get your free Nalsuvai account now.</p>
                  </div>
                  <div className="p-2 mt-4">
                    <form
                      method="POST"
                      action="https://taslim.oceansoftwares.in/nalsuvai/register"
                      className="auth-input"
                    >
                      <input
                        type="hidden"
                        name="_token"
                        value="xppGhoFgTbkYcJgbWk3P960bws0MSMaLAC1d8hVa"
                        autoComplete="off"
                      />

                      <div className="mb-2">
                        <label htmlFor="name" className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="form-control"
                          name="name"
                          required
                          autoComplete="name"
                          autoFocus
                          placeholder="Enter name"
                        />
                      </div>

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
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-input">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          required
                          id="password-input"
                          placeholder="Enter password"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-confirm">
                          Confirm Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="password_confirmation"
                          required
                          id="password-confirm"
                          placeholder="Enter confirm password"
                        />
                      </div>

                      <div>
                        <p className="mb-0">
                          By registering you agree to the Reactly{" "}
                          <a href="#" className="text-primary">
                            Terms of Use
                          </a>
                        </p>
                      </div>

                      <div className="mt-4">
                        <button className="btn btn-primary w-100" type="submit">
                          Register
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          Already have an account?{" "}
                          <a
                            href="/"
                            className="fw-medium text-primary"
                          >
                            Login
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
                  © {new Date().getFullYear()} Nalsuvai. All Rights Reserved. Developed &amp; Maintained By Ocean Softwares
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
