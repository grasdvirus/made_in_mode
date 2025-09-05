
'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useToast } from './use-toast';

export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  hint: string;
  size: string;
  color: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, delta: number) => void;
  clearCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aceplace-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    } finally {
        setIsLoading(false);
    }
  }, []);

  const saveCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addItem = (itemToAdd: CartItem) => {
    const existingItem = cartItems.find(
      item =>
        item.id === itemToAdd.id &&
        item.size === itemToAdd.size &&
        item.color === itemToAdd.color
    );

    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === itemToAdd.id && item.size === itemToAdd.size && item.color === itemToAdd.color
          ? { ...item, quantity: item.quantity + itemToAdd.quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      saveCart([...cartItems, itemToAdd]);
    }
  };

  const removeItem = (id: string, size: string, color: string) => {
    const itemToRemove = cartItems.find(
      item => item.id === id && item.size === size && item.color === color
    );
    const updatedItems = cartItems.filter(
      item =>
        item.id !== id ||
        item.size !== size ||
        item.color !== color
    );
    saveCart(updatedItems);

    if (itemToRemove) {
      toast({
        title: "Article Supprimé",
        description: `${itemToRemove.name} a été retiré de votre panier.`,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (id: string, size: string, color: string, delta: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id && item.size === size && item.color === color
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading
  };

  return React.createElement(CartContext.Provider, { value: value }, children);
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
