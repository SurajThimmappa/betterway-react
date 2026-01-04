import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isInStock = product.stock > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-grow">
        <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover rounded-t-md mb-4" />
        <CardTitle className="text-lg font-semibold line-clamp-2">{product.title}</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.category}</p>
      </CardHeader>
      <CardContent className="flex-grow-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Badge variant={isInStock ? "default" : "destructive"}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!isInStock}
          className="w-full"
        >
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;