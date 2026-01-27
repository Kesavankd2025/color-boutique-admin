import React, { useEffect, useState } from "react";
import apiProvider from "../apiProvider/api";
const DynamicModal = ({ selectedCategory, getSubtitle, fetchCurriculum, updateSubtitles }) => {
    const [subTitles, setSubTitles] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [newSubtitle, setNewSubtitle] = useState("");
    const [getId, setGetId] = useState(localStorage.getItem("getCourseId"))

    // **Filter subtitles when selectedCategory changes**
    console.log(getSubtitle, "getSubtitle");
    console.log(subTitles, "subTitles");
    console.log(selectedCategory, "selectedCategory");



    useEffect(() => {
        if (selectedCategory?.id) {
            const filteredSubtitles =
                getSubtitle && Array.isArray(getSubtitle)
                    ? getSubtitle
                          .filter((item) => item?.value === selectedCategory.id && item?.name)
                          .flatMap((item) => (item.name ? item.name.split(",").map(sub => sub.trim()) : []))
                          .filter((subtitle) => subtitle && subtitle !== "undefined") // Remove undefined values
                    : [];
    
            setSubTitles(filteredSubtitles.length > 0 ? filteredSubtitles : []);
        }
    }, [selectedCategory, getSubtitle]);
    
    // console.log(selectedCategory,"");

    // console.log(getId,"getIdgetId");

    // **Add a new subtitle**
    const addSubtitle = () => {
        const trimmedSubtitle = newSubtitle.trim();
        if (trimmedSubtitle && trimmedSubtitle !== "undefined") {
            setSubTitles((prev) => [...prev, trimmedSubtitle]); // Add valid subtitle
            setNewSubtitle(""); // Reset input field
        } else {
            console.warn("Invalid subtitle: empty or undefined!");
        }
    };
    
    // **Remove a subtitle**
    const removeSubtitle = (index) => {
        setSubTitles(subTitles.filter((_, i) => i !== index));
        setEditIndex(null);
    };

    // **Enable editing**
    const enableEditing = (index) => {
        setEditIndex(index);
    };

    // **Update subtitle text**
    // const handleSubtitleChange = (index, value) => {
    //     const updatedSubTitles = [...subTitles];
    //     updatedSubTitles[index] = value;
    //     setSubTitles(updatedSubTitles);
    // };
    const handleSubtitleChange = (index, value) => {
        const updatedSubTitles = [...subTitles];
        updatedSubTitles[index] = value.trim() !== "undefined" ? value : "";
        setSubTitles(updatedSubTitles);
    };
    

    // **API Call to Update Subtitles**
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure new subtitle is added before submitting
        const finalSubtitles = newSubtitle.trim()
            ? [...subTitles, newSubtitle.trim()]
            : subTitles;

        const formData = new FormData();
        formData.append("id", selectedCategory.id);
        formData.append("subTittle", finalSubtitles.join(",")); // Convert array to string

        try {
            const response = await apiProvider.updateCurriculam(formData);
            console.log("API Response:", response);

            if (response) {
                console.log("enter dddddddddddd");

                fetchCurriculum();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }

        if (updateSubtitles) {
            updateSubtitles(finalSubtitles);
        }

        setEditIndex(null);
        setNewSubtitle(""); // Clear input field after submission
    };
    console.log(subTitles, "subTitles'''''");

    return (
        <div
            className="modal fade"
            id="addModalEdit"
            tabIndex={-1}
            aria-labelledby="addModalEditLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border-bottom">
                        <h1 className="modal-title fs-5" id="addModalEditLabel">
                            {selectedCategory?.tittle || "Edit Subtitles"}
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body p-24">
                        {/* Subtitle List - Only visible if there are subtitles */}
                        {subTitles.length > 0 ? (
                            <ul className="list-group">
                                {subTitles.map((item, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item !=="undefind" ?item:""}
                                                onChange={(e) => handleSubtitleChange(index, e.target.value)}
                                            />
                                        ) : (
                                            <span>{item || "No Subtitle Available"}</span> // Prevent undefined
                                        )}

                                        {editIndex === index ? (
                                            <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => removeSubtitle(index)}>
                                                -
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => enableEditing(index)}>
                                                Edit
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No subtitles available. Add one below.</p>
                        )}


                        {/* Input for New Subtitle */}
                        <input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Enter subtitle..."
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                        />

                        {/* Buttons */}
                        <div className="d-flex gap-2 mt-3">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addSubtitle}>
                                Add More
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DynamicModal;
