import { useState } from 'react'
import './App.css'
import MenuBar from './components/MenuBar.jsx'
import {Routes,Route, useLocation} from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import Explore from './Pages/Explore/Explore.jsx'
import ManageCategory from './Pages/ManageCategory/ManageCategory.jsx'
import ManageUsers from "./Pages/ManageUsers/ManageUsers.jsx"
import ManageItems from './Pages/ManageItems/ManageItems.jsx'
import {Toaster} from 'react-hot-toast'
import Login from './Pages/login/Login.jsx'
import OrderHistory from './Pages/OrderHistory/OrderHistory.jsx'
import PrivateRoute from './components/ProtectedRoute/PrivateRoute.jsx';
import ActivityLog from './components/ActivityLogs/ActivityLog.jsx'
// import { useLocation } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();
  return (
    <>
      {/* <MenuBar/> */}
      {location.pathname !== '/login' && <MenuBar/>}
      <Toaster/>

<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
  <Route
    path="/explore"
    element={
      <PrivateRoute>
        <Explore />
      </PrivateRoute>
    }
  />
  <Route
    path="/activity"
    element={
      <PrivateRoute>
        <ActivityLog />
      </PrivateRoute>
    }
  />
  <Route
    path="/manage-category"
    element={
      <PrivateRoute roles={["ROLE_ADMIN"]}>
        <ManageCategory />
      </PrivateRoute>
    }
  />
  <Route
    path="/manage-users"
    element={
      <PrivateRoute roles={["ROLE_ADMIN"]}>
        <ManageUsers />
      </PrivateRoute>
    }
  />
  <Route
    path="/manage-items"
    element={
      <PrivateRoute>
        <ManageItems />
      </PrivateRoute>
    }
  />
  <Route
    path="/orders"
    element={
      <PrivateRoute>
        <OrderHistory />
      </PrivateRoute>
    }
  />
</Routes>
    </>
  )
}

export default App
