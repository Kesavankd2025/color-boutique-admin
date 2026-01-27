// import { Icon } from "@iconify/react/dist/iconify.js";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import apiProvider from "../apiProvider/api";
// import adminUserApi from "../apiProvider/adminuserapi";
// import { useAlert } from "../context/AlertContext";
// import { login, setUser } from '../redux/authSlice'
// import { useDispatch, useSelector } from 'react-redux'
// import { ToastContainer, toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode'



// const SigninSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string()
//     .min(2, 'Too Short!')
//     .max(50, 'Too Long!')
//     .required('Password is required'),
// });

// const SignInLayer = () => {

//   const disPatch = useDispatch()
//   const { showAlert } = useAlert();
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const togglePasswordVisibility = () => {
//     setShowPassword(prev => !prev);
//   };

//     const handleSubmit = async (values) => {
//     try {
//       const adminLogin = await apiProvider.adminLogin(values)
//       if (adminLogin.status) {
//         toast(adminLogin.response.data.message)
//         const token = adminLogin.response.data.data.token;
//         console.log("test1");
//         disPatch(login({ token: token }))
//         console.log("test2");
//         const decodedToken = jwtDecode(token);
//         console.log(decodedToken,"decodedToken");
//         const userId = decodedToken.id;
//         console.log(userId,"userId");
//         const userData = await adminUserApi.Userbyid(userId);
//         console.log(userData, "userDataduyftrgeuisjduyfidjhfuieruhu");
//         if (userData.status) {
//           disPatch(setUser(userData.response.data));
//         }
//         setTimeout(() => {
//           navigate('/dashboard')
//         }, 3000); // Redirect after 3 seconds
//       }
//       if (!adminLogin.status) {
//         toast.error("Invalid credentials. Please check your email and password.", {
//           autoClose: 2000,
//         });
//       }

//     } catch (error) {
//       console.error("Login failed", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Login failed");
//     }
//   };
//   return (
//     <section className='auth bg-base d-flex flex-wrap'>
//       <div className='auth-left d-lg-block d-none'>
//         <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
//           <img src='assets/images/ilab-logo.png' alt='' />
//         </div>
//       </div>
//       <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
//         <div className='max-w-464-px mx-auto w-100'>
//           <div>
//             <Link to='/' className='mb-40 max-w-290-px'>
//               <img src='assets/images/ilab-logo.png' alt='' />
//             </Link>
//             <h4 className='mb-12'>Sign In to your Account</h4>
//             <p className='mb-32 text-secondary-light text-lg'>
//               Welcome back! please enter your detail
//             </p>
//           </div>
//           <Formik
//             initialValues={{
//               email: '',
//               password: '',
//             }}
//             validationSchema={SigninSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ errors, touched, handleChange, handleBlur }) => (
//               <Form>
//                 <div className='icon-field mb-16'>
//                   <span className='icon top-50 translate-middle-y'>
//                     <Icon icon='mage:email' />
//                   </span>
//                   <input
//                     type='email'
//                     name="email"
//                     className='form-control h-56-px bg-neutral-50 radius-12'
//                     placeholder='Email'
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                   />
//                   {errors.email && touched.email && <div className="error_msg">{errors.email}</div>}
//                 </div>
//                 <div className='position-relative mb-20'>
//                   <div className='icon-field'>
//                     <span className='icon top-50 translate-middle-y'>
//                       <Icon icon='solar:lock-password-outline' />
//                     </span>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       className='form-control h-56-px bg-neutral-50 radius-12'
//                       id='your-password'
//                       placeholder='Password'
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                     />
//                     {errors.password && touched.password && <div className="error_msg">{errors.password}</div>}
//                   </div>
//                   <span
//                     className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
//                     data-toggle='#your-password'
//                     onClick={togglePasswordVisibility}
//                   />
//                 </div>
//                 <div className=''>
//                   {/* <div className='d-flex justify-content-between gap-2'>
//                     <div className='form-check style-check d-flex align-items-center'>
//                       <input
//                         className='form-check-input border border-neutral-300'
//                         type='checkbox'
//                         defaultValue=''
//                         id='remeber'
//                       />
//                       <label className='form-check-label' htmlFor='remeber'>
//                         Remember me{" "}
//                       </label>
//                     </div>
//                     <Link to='#' className='text-primary-600 fw-medium'>
//                       Forgot Password?
//                     </Link>
//                   </div> */}
//                 </div>
//                 <button
//                   type='submit'
//                   className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
//                 >
//                   {" "}
//                   Sign Iwewn
//                 </button>
//               </Form>
//             )}
//           </Formik>
//           {/* <div className='mt-32 center-border-horizontal text-center'>
//             <span className='bg-base z-1 px-4'>Or sign in with</span>
//           </div> */}
//           {/* <div className='mt-32 d-flex align-items-center gap-3'>
//             <button
//               type='button'
//               className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
//             >
//               <Icon
//                 icon='ic:baseline-facebook'
//                 className='text-primary-600 text-xl line-height-1'
//               />
//               Google
//             </button>
//             <button
//               type='button'
//               className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
//             >
//               <Icon
//                 icon='logos:google-icon'
//                 className='text-primary-600 text-xl line-height-1'
//               />
//               Google
//             </button>
//           </div> */}
//           {/* <div className='mt-32 text-center text-sm'>
//             <p className='mb-0'>
//               Don’t have an account?{" "}
//               <Link to='/sign-up' className='text-primary-600 fw-semibold'>
//                 Sign Up
//               </Link>
//             </p>
//           </div> */}

//         </div>
//       </div>
//       <ToastContainer />
//     </section>
//   );
// };

// export default SignInLayer;
