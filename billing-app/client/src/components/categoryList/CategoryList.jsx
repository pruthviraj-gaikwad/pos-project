import { useEffect, useState } from 'react';
import "./CategoryList.css";
import { deleteCategory } from '../../service/CategoryService';
import { toast } from 'react-hot-toast';
import { deleteItem } from '../../service/ItemService';

const CategoryList = ({ categories, setCategories }) => {
    const [searchText, setSearchText] = useState('');
    const [loading,setLoading] = useState(true);
  const filtered = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchText.toLowerCase())
);
useEffect(() => {
    if (categories && categories.length > 0) {
        setLoading(false);
    }
}, [categories]);
if (loading) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-center mt-3">
                <h5 className="text-light fw-bold">Loading Category...</h5>
                <span className="text-light small" style={{color:"white"}}>This may take 5-10 seconds.</span>
            </div>
        </div>
    );
}
const deleteByCategoryId = async (categoryId) => {
    console.log(categoryId);
    try {
        const response = await deleteCategory(categoryId);
        setCategories(prevCategories => prevCategories.filter(category => category.categoryId !== categoryId));
        if (response.status === 202) {
            toast.success("Category Deleted Successfully..!!");
        } else {
            toast.error("Could not delete");
        }
    } catch (error) {
        toast.error("Something went wrong");
    }
};

    return (
        <div className="category-list-container">
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        className="form-control"
                        placeholder="Search by categories..."
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
            <div className="row g-3 pe-2">
                {filtered && filtered.map((category, index) => (
                    <div key={index} className="col-12">
                        <div
                            className="card p-3"
                            style={{ backgroundColor: category.bgColor, minWidth: '100%' }}
                        >
                            <div className="d-flex align-items-center">
                                <div style={{ marginRight: '15px' }}>
                                    <img
                                        src={category.imgUrl}
                                        alt={category.category}
                                        width={60}
                                        height={60}
                                        className="category-image"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-1 text-white">{category.name}</h5>
                                    <p className="mb-0 text-white">{category.items} Items</p>
                                </div>
                                {localStorage.getItem('role') === 'ROLE_ADMIN' && (
                                    <div>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteByCategoryId(category.categoryId)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    </div>
                ))
                
                }
            </div>
        </div>
    );
};

export default CategoryList;
