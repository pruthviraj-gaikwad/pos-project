// Create a new file: /components/RecentOrdersTable.jsx

import React from 'react';

const RecentOrdersTable = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center">
                    <p className="mb-0">No recent orders to display.</p>
                </div>
            </div>
        );
    }
    
    // Function to calculate Grand Total
    const getGrandTotal = (subTotal, tax) => {
        return (subTotal + tax).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };

    return (
        <div className="card shadow-sm">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Order ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col" className="text-end">Grand Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td className="fw-medium">{order.orderId}</td>
                                <td>{order.customerName}</td>
                                <td>{order.phoneNumber}</td>
                                <td className="text-end">{getGrandTotal(order.subTotal, order.tax)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;