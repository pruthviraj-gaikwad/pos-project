import { useContext, useEffect, useState, useRef } from "react";
import { assests } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { addCategory } from "../../service/CategoryService";
import { addItem } from "../../service/ItemService";
import { toast } from 'react-hot-toast'
const ItemForm = () => {
    
    const { categories, setCategories } = useContext(AppContext);
    const { itemsData, setItemsData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [item, setitem] = useState({
        name: "",
        price: 0,
        categoryId: "",
        description: ""
    });
    const onChangeHandle = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setitem((item) => ({ ...item, [name]: value }));
    }
    
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // console.log("OnClick Save");
            setLoading(true);
            if (!image) {
                toast.error("Upload Image.", {
                    duration: 500,
                });
                return;
            }
            console.log("item ", item);
            // console.log(categories);
            if (!image || !item.name || !item.description || !item.categoryId) {
                toast.error("All Fields are required.", {
                    duration: 700,
                });
                return;
            }
            if(localStorage.getItem('role') === 'ROLE_USER'){
            toast.error("Required Admin Previledges");
            return;
            }
            // console.log("Else part");
            // console.log("Image : "+image);
            // console.log(request);
            const response = await addItem(item, image);

            if (response.status === 201) {
                toast.success("Category Added.");
                setLoading(false);
                setItemsData([...itemsData, response.data]);
                setitem({
                    name: "",
                    price: 0,
                    categoryId: "",
                    description: ""
                });
                setImage(null);
            } else {
                toast.error("Error while Uploading.");
            }
            // console.log("After await");
            // console.log(response);
        } catch (error) {

            toast.error("Error while uploading.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="item-form-container" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="mx-2 mt-2">
                <div className="row">
                    <div className="card col-md-8 form-container" style={{ width: '63vw', borderRadius: "7px" }}>
                        <div className="card-body">
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        <img src={image ? URL.createObjectURL(image) : assests.upload} width={48} />
                                    </label>
                                    <input type="file" name="image" id="image" className="form-control" hidden onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Item Name</label>
                                    <input type="text" name="name" id="name" className="form-control" placeholder="Item Name" value={item.name} onChange={onChangeHandle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="categoryId" className="form-label">Select Category</label>
                                    <select name="categoryId" id="category" className="form-control" value={item.categoryId} onChange={onChangeHandle}>
                                        <option value="">---Select Category---</option>
                                        { categories && categories.map((category, index) => (
                                            <option value={category.categoryId} key={category.categoryId}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    {/* &#8377; */}
                                    <input type="number" name="price" id="price" className="form-control" placeholder="200.00" value={item.price} onChange={onChangeHandle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>.
                                    <textarea type="text" rows={4} name="description" id="description" className="form-control" placeholder="Write content here.." value={item.description} onChange={onChangeHandle} />
                                </div>
                                {/* <div className="mb-3">
                                <label htmlFor="bgColor" className="form-label">Background-color</label>
                                <input type="color"  name="bgColor" id="bgColor" className="form-control" placeholder="#2C3335"/>
                            </div> */}
                                <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? 'loading...' : 'Save'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemForm;