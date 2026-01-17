import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { allOrders } from "../../service/OrderService";

const CHART_COLORS = [
  "#667eea", "#4facfe", "#f5576c", "#ffecd2", "#a8edea", "#764ba2",
  "#ff6b6b", "#6bcBef", "#ffa600", "#7fdbda", "#3f72af", "#fc5c65",
  "#2ed573", "#1e90ff", "#ff9ff3", "#48dbfb", "#10ac84", "#f368e0",
  "#00cec9", "#fab1a0", "#55efc4", "#fd79a8", "#e17055", "#ffeaa7"
];


const ChartSkeleton = () => (
  <div className="animate-shimmer rounded p-3 mb-3" style={{ height: '200px' }}></div>
);

const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="border bg-white rounded p-3 shadow-sm">
      <strong>{label}</strong>
      {/* {console.log(payload)} */}
      <ul className="list-unstyled mb-0 mt-2">
        {payload.map((entry, i) => (
            <li key={i} className="d-flex justify-content-between">
            {/* <span>{entry.category}</span> */}
            <span>{prefix}{entry.value?.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const StatsCard = ({ title, value, trend, icon }) => (
  <div className="col-md-4 mb-4">
    <div className="card shadow-sm card-glow transition-smooth">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted text-uppercase small mb-1">{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
          {trend !== undefined && (
            <small className={trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-muted'}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}% from last period
            </small>
          )}
        </div>
        <div className="fs-2">{icon}</div>
      </div>
    </div>
  </div>
);
const ActivityLog = () => {
  const [dailySales, setDailySales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [counter,setCounter]=useState(0);
  const salesStats = useMemo(() => {
    if (!dailySales.length) return { totalSales: 0, avgDaily: 0, trend: 0 };
    const total = dailySales.reduce((sum, d) => sum + d.amount, 0);
    const avg = total / dailySales.length;
    const mid = Math.floor(dailySales.length / 2);
    const first = dailySales.slice(0, mid).reduce((s, d) => s + d.amount, 0) / mid || 1;
    const second = dailySales.slice(mid).reduce((s, d) => s + d.amount, 0) / (dailySales.length - mid || 1);
    const trend = ((second - first) / first) * 100;
    return { totalSales: total, avgDaily: avg, trend };
  }, [dailySales]);

  const categoryStats = useMemo(() => {
    if (!categorySales.length) return { topCategory: "N/A" };
    return {
      topCategory: categorySales.sort((a, b) => b.value - a.value)[0]?.category || "N/A"
    };
  }, [categorySales]);

  const fetchStatsFromOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAnimationComplete(false);

      const res = await allOrders();
      console.log(res.data);
      const orders = res?.data || [];
      const dailyMap = {};
      const categoryMap = {};

      orders.forEach(order => {
        const date = new Date(order.createdAt);
        if (isNaN(date.getTime())) return;
        //[2].items[0].name
        const dateStr = date.toISOString().split("T")[0];
        const amount = parseFloat(order.grandTotal) || 0;
        dailyMap[dateStr] = (dailyMap[dateStr] || 0) + amount;

        (order.items || []).forEach(item => {
          const category = item.name || "Unknown";
          const value = parseFloat(item.price) || 0;
          categoryMap[category] = (categoryMap[category] || 0) + value;
        });
      });

      const dailyArray = Object.entries(dailyMap).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(),
        amount
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      const categoryArray = Object.entries(categoryMap).map(([category, value]) => ({
        category, value
      }));

      setDailySales(dailyArray);
      setCategorySales(categoryArray);
      setTimeout(() => setAnimationComplete(true), 400);
    //   console.log(categoryArray);
    //   console.log("MAP:",categoryMap);
    } catch (err) {
      setError("Failed to load data");
    } finally {

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsFromOrders();
  }, []);
  if (error) {
    if(counter === 3){
      Navigate("/login")
    }
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">
          {error}
          {() =>setCounter(counter+1)}
        </div>
        <button className="btn btn-primary" onClick={fetchStatsFromOrders}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="row">
          {[...Array(3)].map((_, i) => (
            <div className="col-md-4" key={i}>
              <ChartSkeleton />
            </div>
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">📊 Sales Dashboard</h2>
      <div className="row">
        <StatsCard title="Total Sales" value={`₹${salesStats.totalSales.toFixed(2)}`} trend={salesStats.trend} icon="💰" />
        <StatsCard title="Avg Daily Sales" value={`₹${salesStats.avgDaily.toFixed(2)}`} icon="📈" />
        <StatsCard title="Top Category" value={categoryStats.topCategory} icon="🏆" />
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 mb-4">
          <div className="card p-3 shadow-sm">
            <h5 className="card-title">📈 Daily Sales Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#667eea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card p-3 shadow-sm">
            <h5 className="card-title">🥧 Category Breakdown</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={categorySales} outerRadius={100}>
                  {categorySales.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
