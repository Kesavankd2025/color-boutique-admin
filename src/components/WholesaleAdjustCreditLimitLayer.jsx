// import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import hljs from "highlight.js";
import ReactQuill from "react-quill-new";
import DynamicModal from '../model/DynamicModel';
import apiProvider from '../apiProvider/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const WholesaleAdjustCreditLimit = () => {

    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [curriculamForm, setCurriculamForm] = useState({
        name: "", serial: ""
    })
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [curriculamData, setCurriculamData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [getId, setGetId] = useState(localStorage.getItem("getCourseId") ?? "");
    const location = useLocation();
    const { editDatas } = location.state || {};

    const [courseId, setCourseId] = useState("")

    const [currentStep, setCurrentStep] = useState(1);
    const quillRef = useRef(null);
    const [isHighlightReady, setIsHighlightReady] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [getSubtitle, setgetSubtitle] = useState();

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [formData, setFormData] = useState({
        wholesalerName: '',
        assignedSalesman: '',
        salesmanContact: ''
    });


    const handleEditClick = (item) => {
        setIsEditMode(true)
        setSelectedItem(item);
        // console.log(item, "item");

        setCurriculamForm({ name: item.tittle, serial: item.serial, id: item.id });
    };

    const handleChangeForModul = (e) => {
        const { name, value } = e.target;
        setCurriculamForm((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const navagatoFun = () => {
        navigate(`/course`)
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleChange = (e) => {
        // console.log("enetr halchangeee");

        const { name, value, type, files } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
    };

    const formValidation = (e) => {
        const newErrors = {};
        if (!formData.wholesalerName) newErrors.wholesalerName = "Wholesaler name is required";
        if (!formData.assignedSalesman) newErrors.assignedSalesman = "Assigned salesman name is required";
        if (!formData.salesmanContact) newErrors.salesmanContact = "Salesman contact is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formValidation()) return;
        console.log("formData :", formData);

        try {
            let response;
            if (isEditMode) {
                // For edit mode, include the ID and use update endpoint
                // input.append("id", formData.id);
                response = await apiProvider.updateCourse(formData);
            } else {
                // For create mode
                if (formData.courseName) {
                    response = await apiProvider.addCourse(formData);
                }
            }

            console.log(response, "response-g");

            if (response) {
                console.log("enter submit--------------fun");

                let editDataId = response.response.data.data.id || response.response.data.data.userEditId
                localStorage.setItem("getCourseId", editDataId)
                toast(response.response.data.message)
                setGetId(editDataId)
                // Reset form
                // setFormData({
                //     categoryType: "1", // Changed from "online" to "1" to match your select values
                //     categoryName: "",
                //     categoryStatus: "Active", // Changed to lowercase to match your select values
                //     categorySlug: "",
                //     categoryImage: ""
                // });

                // Refresh data
                fetchCurriculum();

                // Reset edit mode
                // setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // You might want to add error handling here (show toast, etc.)
        }
        // Add your form submission logic here
    };

    const handleCurriculamSubmit = async (e) => {
        // e.preventDefault();
        // console.log("Form submitted:", curriculamForm);

        const input = new FormData();
        input.append("courseId", getId);
        input.append("tittle", curriculamForm.name);
        input.append("serial", curriculamForm.serial);
        input.append("subTittle", curriculamForm.subTittle);

        // console.log(...input, "input");

        try {
            let response;
            if (isEditMode) {
                // For edit mode, include the ID and use update endpoint
                input.append("id", curriculamForm.id);
                response = await apiProvider.updateCurriculam(input);
            } else {
                // For create mode
                response = await apiProvider.addCurriculam(input);
            }

            console.log(response, "response-curi");

            if (response) {
                toast(response.response.data.message)

                // Refresh data
                // fetchCategories();
                fetchCurriculum();

                // Reset edit mode
                // setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // You might want to add error handling here (show toast, etc.)
        }
        // Add your form submission logic here
    }


    useEffect(() => {
        // Load highlight.js configuration and signal when ready
        hljs?.configure({
            languages: [
                "javascript",
                "ruby",
                "python",
                "java",
                "csharp",
                "cpp",
                "go",
                "php",
                "swift",
            ],
        });
    }, []);

    const fetchCategories = async () => {
        // console.log("enetr ffffffffff");

        try {
            const categoryResult = await apiProvider.getCategory();
            if (categoryResult?.response?.data?.data) {
                const updatedCategories = categoryResult.response.data.data.map(ival => ({
                    ...ival,
                    categoryName: `${ival.categoryName} / ${ival.categoryType === "1" ? "Online" : "Offline"}`
                }));
                setCategories(updatedCategories);
            }


        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCurriculum = async () => {
        try {
            const curriculumResult = await apiProvider.getCurriculam();
            if (curriculumResult?.response?.data?.data) {
                // console.log(curriculumResult.response.data.data, "curriculum data", getId, "getId");

                // Filter curriculum based on courseId
                const filteredData = curriculumResult.response.data.data.filter(ival => ival.courseId == getId);
                setCurriculamData(filteredData);
                // console.log(filteredData, "filteredData");

                // Prepare subtitles
                const subtitles = filteredData.map(ival => ({
                    name: ival.subTittle,
                    value: ival.id,
                    courseId: ival.courseId,
                }));

                setgetSubtitle(subtitles);
            }

            const reviewResult = await apiProvider.getReview();
            console.log(reviewResult, "reviewResult");

            if (reviewResult?.response?.data?.data) {
                const filteredReviewData = reviewResult.response.data.data.filter(ival => ival.courseId == getId);
                console.log(filteredReviewData, "filteredReviewData- revieww");
                setReviewData(filteredReviewData);
            }
        } catch (error) {
            console.error('Error fetching curriculum:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (getId) {
            fetchCurriculum();
        }
    }, [getId]);
    // eslint-disable-next-line no-unused-vars
    const handleSave = () => {
        const editorContent = quillRef.current.getEditor().root.innerHTML;
        // console.log("Editor content:", editorContent);
    };

    const handleRichTextChange = useCallback((value) => {
        setFormData((prev) => ({
            ...prev,
            description: value, // Update description field
        }))
    }, [])

    // Quill editor modules with syntax highlighting (only load if highlight.js is ready)
    const modules = isHighlightReady
        ? {
            syntax: {
                highlight: (text) => hljs?.highlightAuto(text).value, // Enable highlight.js in Quill
            },
            toolbar: {
                container: "#toolbar-container",
            },
        }
        : {
            toolbar: {
                container: "#toolbar-container",
            },
        };

    const formats = [
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "script",
        "header",
        "blockquote",
        "code-block",
        "list",
        "indent",
        "direction",
        "align",
        "link",
        "image",
        "video",
        "formula",
    ];

    useEffect(() => {
        if (!editDatas) return;
        setIsEditMode(true)
        // console.log(editDatas, "editDatas-props function");
        // return false
        setFormData({
            courseName: editDatas.courseName || '',
            // categoryType: (editDatas.categoryName || '') + " / " + (editDatas.categoryType || ''),
            categoryType: editDatas.categoryId,
            InstructorName: editDatas.instructorName || '',
            language: 'English',
            offerPrice: editDatas.offerPrice || '',
            price: editDatas.price || '',
            shortDescription: editDatas.shortDescription || '',
            description: editDatas.description || '',
            slug: editDatas.course_slug || '',
            id: editDatas.id || null
        });
    }, []);

    // Function to handle status change
    const handleStatusChange = async (id, newStatus) => {
        const input = new FormData();
        input.append("id", id);
        input.append("status", newStatus);

        // console.log(...input, "input");

        try {
            let response = await apiProvider.reviewUpdate(input);

            console.log(response, "response-review");

            if (response) {
                toast(response.response.data.message)

                // Refresh data
                // fetchCategories();
                fetchCurriculum();
                navigate(`/course`)

                // Reset edit mode
                // setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // You might want to add error handling here (show toast, etc.)
        }
    };

    // console.log(editDatas, "editDatas");


    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <div className='col-md-12'>
                    <div className='card-body'>

                        {/* Form Wizard Start */}
                        <div className='form-wizard'>
                            <div >

                                <fieldset
                                    className={`wizard-fieldset ${currentStep === 1 && "show"} `}
                                >

                                    <div className='row gy-3'>

                                        <div class="col-sm-6"><label class="form-label">Wholesaler Name</label>
                                            <div class="position-relative">
                                                <select class="form-select" name="wholesalerName" value={formData.wholesalerName} onChange={handleChange}>
                                                    <option value="">Select</option>
                                                    <option value="Anbarasan">Anbarasan</option>
                                                    <option value="ArunKumar">ArunKumar</option>
                                                    <option value="Deepan">Deepan</option>
                                                </select>
                                                {errors.wholesalerName && <div className='text-danger'>{errors.wholesalerName}</div>}
                                                <div class="wizard-form-error">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-sm-6"><label class="form-label">Assigned Salesman</label>
                                            <div class="position-relative"><select class="form-select" name="assignedSalesman" value={formData.assignedSalesman} onChange={handleChange} >
                                                <option value="">Select</option>
                                                <option value="Anbarasan">Anbarasan</option>
                                                <option value="ArunKumar">ArunKumar</option>
                                                <option value="Deepan">Deepan</option>
                                            </select>
                                                {errors.assignedSalesman && <div className='text-danger'>{errors.assignedSalesman}</div>}

                                                <div class="wizard-form-error">
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <label className='form-label'>Salesman Contact</label>
                                            <div className='position-relative'>
                                                <input
                                                    type='text'
                                                    className='form-control wizard-required'

                                                    required=''
                                                    name="salesmanContact"
                                                    value={formData.salesmanContact}
                                                    onChange={handleChange}


                                                />
                                                {errors.salesmanContact && <div className="text-danger">{errors.salesmanContact}</div>}

                                                <div className='wizard-form-error' />
                                            </div>
                                        </div>







                                        <div className='form-group text-end'>
                                            <button

                                                type='ffff'
                                                className='form-wizard-next-btn btn btn-secondary me-1 px-32'
                                            >
                                                Cancel
                                            </button>
                                            <button

                                                type='ffff'
                                                className='form-wizard-next-btn btn btn-primary px-32'
                                                onClick={handleSubmit}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>



                            </div>
                        </div>
                        {/* Form Wizard End */}
                    </div>
                </div>
            </div>


        </div>


    )
}

export default WholesaleAdjustCreditLimit;