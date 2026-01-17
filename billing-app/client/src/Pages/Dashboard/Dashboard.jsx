import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchDashboard } from '../../service/DashboardService';
import './Dashboard.css'; // Custom styles (see below)

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [counter,setCounter] = useState(0);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetchDashboard();
        setData(response.data);
        toast.success("Dashboard loaded");
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error("Unable to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  // Go to order details
  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <p>Failed to load dashboard data</p>
        <button onClick={() => window.location.reload()} className="reload-btn">
          Try Again
        </button>
        {()=>setCounter(counter+1)}
        if({counter === 3}){
          navigate('/login')
        }
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleString()}</p>
      </header>

      <div className="summary-cards">
        <div className="card">
          <h3>Today's Sales</h3>
          <p className="value sales">{formatCurrency(data.todaysSales)}</p>
          <p className="label">Total revenue</p>
        </div>
        <div className="card">
          <h3>Today's Orders</h3>
          <p className="value orders">{data.todayOrderCount}</p>
          <p className="label">Orders placed</p>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {data.recentOrders.length === 0 ? (
          <p className="empty">No recent orders found</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    onClick={() => handleOrderClick(order.orderId)}
                    className="order-row"
                  >
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber}</td>
                    <td>{formatCurrency(order.subTotal)}</td>
                    <td>{formatCurrency(order.tax)}</td>
                    <td>{formatCurrency(order.subTotal + order.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
