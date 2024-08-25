"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTotalCartItems } from '../services/bookingCartService';
import Cookies from 'js-cookie'; // Sử dụng js-cookie để lấy token từ cookies

interface CartContextProps {
  totalItems: number;
  fetchTotalItems: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalItems, setTotalItems] = useState(0);

  const fetchTotalItems = async () => {
    const token = Cookies.get("tokenUser"); // Lấy token từ cookies
    if (token) {
      const total = await getTotalCartItems();
      setTotalItems(total);
    }
  };

  useEffect(() => {
    fetchTotalItems();
  }, []);

  return (
    <CartContext.Provider value={{ totalItems, fetchTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
