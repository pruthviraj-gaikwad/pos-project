import './ManageCategory.css'
import CategoryForm from '../../components/categoryForm/CategoryForm';
import CategoryList from '../../components/categoryList/CategoryList';
import {useState,useEffect} from 'react';
import { allCategories } from '../../service/CategoryService';
const ManageCategory = () => {
    const[categories,setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await allCategories();
                setCategories(response.data);
            } catch (error) {
                toast.error("Could not Fetch Categories", {
                    duration: 1000,
                });
            }
        }
        fetchCategories();
    }, []);
    return (
        <div className="category-container text-light">
            <div className="left-column">
                <CategoryForm setCategories={setCategories} />
            </div>
            <div className="right-column">
                <CategoryList categories={categories} setCategories={setCategories}/>
            </div>
        </div>
    );
}

export default ManageCategory;