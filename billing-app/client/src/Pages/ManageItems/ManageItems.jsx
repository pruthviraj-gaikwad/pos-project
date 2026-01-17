import { useContext, useEffect } from 'react';
import { AppContext } from "../../context/AppContext";
import { allItems } from "../../service/ItemService";
import { toast } from "react-hot-toast";
import ItemForm from "../../components/itemForm/ItemForm";
import ItemsList from "../../components/itemsList/ItemsList";
import "./ManageItems.css";

const ManageItems = () => {
    const { setItemsData } = useContext(AppContext);  // ✅ use context here

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await allItems();
                setItemsData(response.data);  // ✅ store in context, not local state
            } catch (error) {
                // toast.error("Could not fetch items", {
                //     duration: 1000,
                // });
            }
        };
        fetchItems();
    }, [setItemsData]);

    return (
        <div className="items-container text-light">
            <div className="left-column">
                <ItemForm />
            </div>
            <div className="right-column">
                <ItemsList />
            </div>
        </div>
    );
};

export default ManageItems;
