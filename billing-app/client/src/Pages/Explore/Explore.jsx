import { useContext } from "react";
import "./Explore.css"
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../components/categoryList/CategoryList";
import { allCategories } from "../../service/CategoryService";
import { useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import DisplayCategory from "../../components/DisplayCategory/DisplayCategory";
import DisplayItem from "../../components/DisplayItem/DisplayItem";
import CustomerForm from "../../components/customerForm/CustomerForm";
import CartItems from "../../components/CartItems/CartItems";
import CartSummary from "../../components/CartSummary/CartSummary";
const Explore=()=>{
    const {categories,setCategories} = useContext(AppContext);
    const [selectedCategory,setSelectedCategory] = useState("");
    const [customerName,setCustomerName] = useState('');
    const [mobileNumber,setMobileNumber] = useState('');
    useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await allCategories();
            setCategories(res.data);  // Make sure this matches the response shape
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    };

    fetchCategories();
}, []);

    return(
        <div className="explore-container text-light">
            <div className="left-column">
                <div className="first-row" style={{overflowY: 'auto'}}>
                        <DisplayCategory 
                        selectedCategory = {selectedCategory}
                        setSelectedCategory= {setSelectedCategory}
                        categories={categories}/>
                </div>
                <hr className="horizontal-line"/>
                <div className="second-row" style={{overflowY: 'auto'}}>
                        <DisplayItem selectedCategory={selectedCategory}/>
                </div>
            </div>
            <div className="right-column d-flex flex-column">
                <div className="customer-form-container" style={{height:'15%'}}>
                    <CustomerForm 
                        customerName={customerName}
                        mobileNumber={mobileNumber}
                        setCustomerName={setCustomerName}
                        setMobileNumber={setMobileNumber}
                    />
                </div>
                <hr className="my-3 text-light"/>
                
                <div className="cart-items-container">
                    <CartItems/>
                </div>
                <div className="cart-summary-container">
                  <CartSummary
                    customerName={customerName}
                    mobileNumber={mobileNumber}
                    setCustomerName={setCustomerName}
                    setMobileNumber={setMobileNumber}
                />
                </div>
            </div>
        </div>
    );
}
export default Explore;