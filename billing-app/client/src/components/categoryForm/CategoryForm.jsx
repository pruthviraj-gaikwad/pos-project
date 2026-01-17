import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import "./CategoryForm.css";
import { addCategory } from '../../service/CategoryService.js';
import CategoryList from '../categoryList/CategoryList.jsx';
import { assests } from "../../assets/assets.js";

const CategoryForm = ({ setCategories }) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [categoryDetails, setCategoryDetails] = useState({
        name: '',
        description: '',
        bgColor: '',
        
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!image) {
            toast.error("Upload Image.", { duration: 500 });
            setLoading(false);
            return;
        }

        if (!categoryDetails.name || !categoryDetails.description || !categoryDetails.bgColor) {
            toast.error("All Fields are required.", { duration: 700 });
            setLoading(false);
            return;
        }

        if(localStorage.getItem('role') === 'ROLE_USER'){
            toast.error("Required Admin Previledges");
            return;
        }
        // console.log(categoryDetails.bgColor);
        try {
            const response = await addCategory(categoryDetails, image);
            if (response.status === 201) {
                setLoading(true);
                toast.success("Category Added.");
                setCategories((prevCategories) => [...prevCategories, response.data]);
                setCategoryDetails({
                    name: '',
                    description: '',
                    bgColor: ''
                });
                setImage(null);
            } else {
                toast.error("Error while Uploading.");
            }
        } catch (error) {
            toast.error("Error while uploading.");
        }
        setLoading(false);
    }

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-8 form-container" style={{ width: '70vw' }}>
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="upload" className="form-label">Upload Image</label><br />
                                <label htmlFor="image" className="form-label">
                                    <img src={image ? URL.createObjectURL(image) : assests.upload} width={48} />
                                </label>
                                <input type="file" accept="image/*" name="image" id="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} hidden />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="category"
                                    id="name"
                                    className="form-control"
                                    placeholder="Category-name"
                                    value={categoryDetails.category}
                                    onChange={(e) => setCategoryDetails({ ...categoryDetails, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    rows={5}
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    placeholder="Write content here.."
                                    value={categoryDetails.description}
                                    onChange={(e) => setCategoryDetails({ ...categoryDetails, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bgColor" className="form-label">Background-color</label>
                                <input
                                    type="color"
                                    name="bgColor"
                                    id="bgColor"
                                    className="form-control"
                                    placeholder="#2C3335"
                                    value={categoryDetails.bgColor || "#000000"}
                                    onChange={(e) =>
                                        setCategoryDetails({ ...categoryDetails, bgColor: (e.target.value).toString() })
                                    }
                                />
                            </div>
                            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryForm;
