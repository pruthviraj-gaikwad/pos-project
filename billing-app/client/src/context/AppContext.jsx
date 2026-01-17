import { createContext, useState, useEffect } from "react";
export const AppContext = createContext(null);

import { allCategories } from "../service/CategoryService.js";
import { allItems } from "../service/ItemService.js";

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [auth, setAuth] = useState({ token: "", role: "" });
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.itemId === item.itemId);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.itemId === item.itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.itemId !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantityCart = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.itemId === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const setAuthData = (token, role) => {
    setAuth({ token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  // ✅ Load token from localStorage on mount
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const localRole = localStorage.getItem("role");
    if (localToken && localRole) {
      setAuthData(localToken, localRole);
    }
  }, []);

  // ✅ Fetch categories immediately
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await allCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // ✅ Only fetch items when token is present
  useEffect(() => {
    async function fetchItems() {
      try {
        if (auth.token) {
          const itemResponse = await allItems();
          setItemsData(itemResponse.data);
        }
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    }
    fetchItems();
  }, [auth.token]);

  const contextValue = {
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
    addToCart,
    cartItems,
    removeFromCart,
    updateQuantityCart,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
