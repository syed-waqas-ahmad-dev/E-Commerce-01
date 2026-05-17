import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import { Search, Package, CheckCircle2, Truck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/types';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Order not found');
          setOrder(null);
        } else {
          throw error;
        }
      } else {
        setOrder(data);
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error(error.message || 'Failed to fetch order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-success" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-warning" />;
      default:
        return <Package className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Track Your Order</h1>
          <p className="text-lg max-w-2xl mx-auto text-pretty">
            Enter your order ID to track your shipment status
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enter Order ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading} className="gap-2">
                    <Search className="h-4 w-4" />
                    {loading ? 'Searching...' : 'Track'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can find your order ID in your order confirmation email
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {searched && order && (
          <Card className="max-w-2xl mx-auto mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-semibold text-lg">
                    {order.status === 'completed' && 'Order Delivered'}
                    {order.status === 'pending' && 'Order Processing'}
                    {order.status === 'cancelled' && 'Order Cancelled'}
                    {order.status === 'refunded' && 'Order Refunded'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(order.total_amount / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {order.customer_email && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Email: {order.customer_email}
                  </p>
                  {order.customer_name && (
                    <p className="text-sm text-muted-foreground">
                      Name: {order.customer_name}
                    </p>
                  )}
                </div>
              )}

              {order.status === 'completed' && order.completed_at && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">
                      Delivered on {new Date(order.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {searched && !order && !loading && (
          <Card className="max-w-2xl mx-auto mt-6">
            <CardContent className="pt-6 text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground">
                Please check your order ID and try again
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
