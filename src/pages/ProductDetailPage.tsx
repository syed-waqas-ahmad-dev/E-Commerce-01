import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { StockIndicator } from '@/components/products/StockIndicator';
import { QuantitySelector } from '@/components/products/QuantitySelector';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/db/supabase';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const success = await addToCart(product.id, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full bg-muted" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-1/4 bg-muted" />
              <Skeleton className="h-20 w-full bg-muted" />
              <Skeleton className="h-12 w-full bg-muted" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-sm text-muted-foreground">{product.category.name}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-warning text-warning" />
                <span className="text-lg font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
              </div>
            </div>

            <StockIndicator stockQuantity={product.stock_quantity} showQuantity />

            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground text-pretty">{product.description}</p>
              </div>
            )}

            {!isOutOfStock && (
              <div>
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <QuantitySelector
                  value={quantity}
                  max={product.stock_quantity}
                  onChange={setQuantity}
                />
              </div>
            )}

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
