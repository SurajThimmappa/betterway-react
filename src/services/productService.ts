import { Product } from '@/types/product';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  
  // --- START: Temporary modification to simulate an out-of-stock product ---
  if (data.products.length > 0) {
    data.products[0].stock = 0; // Set the first product's stock to 0
  }
  // --- END: Temporary modification ---

  return data.products;
};
