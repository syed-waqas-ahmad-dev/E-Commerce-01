import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isOutOfStock = (product.stock_quantity ?? 0) === 0;
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isOutOfStock) {
      await addToCart(product.id);
    }
  };

  const price = Number(product.price ?? 0);
  const rating = Number(product.rating ?? 0);
  const reviewCount = product.review_count ?? 0;

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-lg border-0 bg-card relative">

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`h-4 w-4 ${
              inWishlist ? 'fill-destructive text-destructive' : 'text-foreground'
            }`}
          />
        </Button>

        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted rounded-t-lg">

          {product.category?.name && (
            <Badge className="absolute top-2 left-2 z-10 text-xs font-medium bg-background/90 text-foreground border-0">
              {product.category.name}
            </Badge>
          )}

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-3 flex flex-col">

          {/* Name */}
          <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2">
            {product.name ?? 'No name'}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />

            <span className="text-sm font-semibold">
              {rating.toFixed(1)}
            </span>

            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>

          {/* Price + Button */}
          <div className="mt-auto space-y-2">

            <p className="text-lg font-bold text-foreground">
              ${price.toFixed(2)}
            </p>

            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            ) : (
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}