import { Product } from '@/types/product';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.products;
};