// src/components/itemsList/ItemsList.jsx
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { deleteItem } from '../../service/ItemService';
import { toast } from 'react-hot-toast';

const ItemsList = () => {
    const [searchText, setSearchText] = useState('');
    const { itemsData, setItemsData } = useContext(AppContext);

    const filteredItems = itemsData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const deleteItemById = (id) => {
        try {
            const fetchItemToDelete = async (itemId) => {
                const response = await deleteItem(itemId);
                if (response.status === 204) {
                    setItemsData(prevItems => prevItems.filter(item => item.itemId !== itemId));
                    toast.success("Item deleted!");
                } else {
                    toast.error("Unable to delete.");
                }
            };
            fetchItemToDelete(id);
        } catch (error) {
            toast.error("Couldn't delete item!", {
                duration: 2000,
            });
        }
    };

    return (
        <div className="item-list-container">
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        className="form-control"
                        placeholder="Search items..."
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
            <div className="row g-3 pe-2">
                {Array.isArray(filteredItems) && filteredItems.map((item, index) =>
                    <div key={index} className='col-12'>
                        <div className='card p-3 bg-dark' style={{ minWidth: '100%' }}>
                            <div className="d-flex align-items-center">
                                <div style={{ marginRight: '15px' }}>
                                    <img src={item.imageUrl} width={60} height={60} alt={item.name} className='item-image bg-light' />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className='mb-1 text-white'>{item.name}</h5>
                                    <p className='mb-0 text-white'>Category: {item.categoryName}</p>
                                    <span className="mb-0 text-block badge rounded-pill text-bg-warning">{item.price} ₹</span>
                                </div>
                                <div>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteItemById(item.itemId)}>
                                        <i className='bi bi-trash'></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsList;
