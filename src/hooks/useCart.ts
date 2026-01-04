import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '@/types/product';
import { toast } from 'sonner';

const CART_STORAGE_KEY = 'ecommerce_cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.title} to cart.`);
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        toast.success(`${quantityToAdd} ${product.title}(s) added to cart.`);
        return updatedItems;
      } else {
        if (quantityToAdd > product.stock) {
          toast.error(`Cannot add more than ${product.stock} of ${product.title} to cart.`);
          return prevItems;
        }
        toast.success(`${quantityToAdd} ${product.title}(s) added to cart.`);
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.title} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number, productStock: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === productId);

      if (existingItemIndex > -1) {
        if (newQuantity <= 0) {
          toast.info(`Quantity for ${prevItems[existingItemIndex].title} set to 0. Item removed.`);
          return prevItems.filter((item) => item.id !== productId);
        }
        if (newQuantity > productStock) {
          toast.error(`Cannot set quantity more than ${productStock} for this product.`);
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedItems;
      }
      return prevItems;
    });
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  };
};
