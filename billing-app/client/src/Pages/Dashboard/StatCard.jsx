// Create a new file: /components/StatCard.jsx

import React from 'react';

// Helper for currency formatting
const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    });
};

const StatCard = ({ title, value, icon, color, isCurrency = false }) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
                        <h3 className="card-title mb-0">
                            {isCurrency ? formatCurrency(value) : value}
                        </h3>
                    </div>
                    <div className={`fs-1 ${color}`}>
                        <i className={`bi ${icon}`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;