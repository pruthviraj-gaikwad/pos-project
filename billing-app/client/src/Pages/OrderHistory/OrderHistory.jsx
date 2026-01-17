import React, { useEffect, useState } from 'react'
import './OrderHistory.css'
import { allOrders } from '../../service/OrderService';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await allOrders();
                setOrders(response.data)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    },[])

    const formatItems = (items) => {
        return items.map((item) => `${item.name}x${item.quantity}`).join(', ');

    }
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }

        return new Date(dateString).toLocaleDateString('en-US', options);
    }

if (loading) {
    return (
        // Vertically and horizontally centered container
        <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
            
            {/* Using a larger spinner for more impact */}
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>

            <div className="text-center mt-3">
                {/* Main message with more emphasis */}
                <h5 className="text-dark fw-bold">Loading Orders...</h5>
                
                {/* Secondary, helpful text is more subtle */}
                <p className="text-muted small">This may take 10-20 seconds.</p>
            </div>
            
        </div>
    );
}

    if (orders.length === 0) {
        return <div className="text-center py-4">No Orders Found</div>
    }
    return (
        <div className="orders-history-container">
            <h2 className="mb-2 text-light">
                All Orders
            </h2>
            <div className="table-responsive">
                <table className='table table-striped table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Order Id</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.customerName} <br />
                                    <i className="bi bi-telephone"></i>&nbsp;<small className='text-muted'>{ order.phoneNumber}</small>
                                </td>
                                <td>{formatItems(order.items)}</td>
                                <td>{order.grandTotal}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <span className={`badge ${order.paymentDetails?.paymentStatus === "COMPLETED" ? "bg-success" : "bg-warning text-dark"}`}>
                                        {order.paymentDetails?.paymentStatus || "Pending."}
                                    </span>
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                                {console.log("Order Created At:", order.createdAt)}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderHistory
