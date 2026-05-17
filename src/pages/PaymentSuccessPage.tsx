import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/db/supabase';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
          body: { sessionId },
        });

        if (error) {
          const errorMsg = await error?.context?.text();
          throw new Error(errorMsg || error.message);
        }

        if (data?.data?.verified) {
          setVerified(true);
          setPaymentDetails(data.data);
          toast.success('Payment verified successfully');
        } else {
          setVerified(false);
          toast.error('Payment verification failed');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        toast.error(error.message || 'Failed to verify payment');
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (verifying) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
              <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!sessionId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-2">Invalid Payment Session</h1>
              <p className="text-muted-foreground mb-6">
                No payment session found. Please try again.
              </p>
              <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!verified) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't verify your payment. Please contact support if you were charged.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate('/account/orders')}>View Orders</Button>
                <Button variant="outline" onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-success" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {paymentDetails && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-semibold">
                      ${((paymentDetails.amount || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  {paymentDetails.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{paymentDetails.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/account/orders')}>View My Orders</Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
