import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasOutOfStockItems = cartItems.some(
    (item) => item.product.stock_quantity === 0 || item.quantity > item.product.stock_quantity
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <OrderSummary subtotal={subtotal} total={subtotal} />
              {hasOutOfStockItems && (
                <p className="text-sm text-destructive mt-4 text-center">
                  Some items are out of stock or exceed available quantity
                </p>
              )}
              <Button
                className="w-full mt-4 gap-2"
                size="lg"
                onClick={() => navigate('/checkout')}
                disabled={hasOutOfStockItems}
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
