import React, { useEffect, useRef, useState } from "react";

interface PayPalButtonOfficialProps {
  amount: string;
  currency: string;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalButtonOfficial({ amount, currency }: PayPalButtonOfficialProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isComponentMounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadPayPalScript = async () => {
      try {
        // Check if PayPal SDK is already loaded
        if (window.paypal) {
          // Add small delay to ensure DOM is ready
          timeoutId = setTimeout(() => {
            if (isComponentMounted) {
              initializePayPal();
            }
          }, 100);
          return;
        }

        // Get client ID from server environment
        const response = await fetch('/api/paypal/setup');
        if (!response.ok) {
          throw new Error('Failed to fetch PayPal setup');
        }
        const data = await response.json();
        
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=${currency}&intent=capture&components=buttons&disable-funding=credit,card&vault=false`;
        script.async = true;
        script.onload = () => {
          // Add delay to ensure PayPal SDK is fully initialized
          timeoutId = setTimeout(() => {
            if (isComponentMounted) {
              initializePayPal();
            }
          }, 200);
        };
        script.onerror = () => {
          if (isComponentMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        };
        document.head.appendChild(script);
      } catch (error) {
        if (isComponentMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    const initializePayPal = () => {
      if (!window.paypal || !paypalRef.current || !isComponentMounted) {
        return;
      }

      // Clean up previous buttons instance with error handling
      if (buttonsRef.current) {
        try {
          if (typeof buttonsRef.current.close === 'function') {
            buttonsRef.current.close();
          }
        } catch (e) {
          // Ignore cleanup errors
        }
        buttonsRef.current = null;
      }

      try {
        buttonsRef.current = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 40
          },
          
          createOrder: async function() {
            try {
              const response = await fetch("/api/paypal/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  amount: amount,
                  currency: currency,
                  intent: "CAPTURE"
                })
              });
              
              if (!response.ok) {
                throw new Error('Failed to create order');
              }
              
              const order = await response.json();
              console.log('Order created successfully:', order.id);
              return order.id;
            } catch (error) {
              console.error('Error creating order:', error);
              throw error;
            }
          },
          
          onApprove: async function(data: any) {
            try {
              console.log('Payment approved, capturing order:', data.orderID);
              
              const response = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                }
              });
              
              if (!response.ok) {
                throw new Error('Failed to capture payment');
              }
              
              const orderData = await response.json();
              console.log('Payment captured successfully:', orderData);
              
              if (orderData.status === 'COMPLETED') {
                // Navigate to success page with order data
                window.location.href = `/order-success?order_id=${data.orderID}&status=completed`;
              }
            } catch (error) {
              console.error('Error capturing payment:', error);
              alert('Payment processing error. Please contact support.');
            }
          },
          
          onError: function(err: any) {
            console.error('PayPal button error:', err);
            // Advanced Checkout handles most errors gracefully
          },
          
          onCancel: function(data: any) {
            console.log('Payment cancelled by user:', data);
            // User cancelled - no action needed
          }
        });

        buttonsRef.current.render(paypalRef.current).then(() => {
          if (isComponentMounted) {
            setIsLoading(false);
          }
        }).catch((error: any) => {
          console.error('Error rendering PayPal buttons:', error);
          if (isComponentMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error initializing PayPal buttons:', error);
        if (isComponentMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadPayPalScript();

    return () => {
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (buttonsRef.current) {
        try {
          if (typeof buttonsRef.current.close === 'function') {
            buttonsRef.current.close();
          }
        } catch (e) {
          // Ignore cleanup errors
        }
        buttonsRef.current = null;
      }
    };
  }, [amount, currency]);

  if (hasError) {
    return (
      <div className="w-full p-4 text-center border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-600">Payment options temporarily unavailable</p>
        <button 
          onClick={() => {
            setHasError(false);
            setIsLoading(true);
            // Retry will happen through useEffect dependency change
          }}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="w-full p-4 text-center border border-gray-300 rounded-md bg-gray-50">
          <p className="text-gray-600">Loading payment options...</p>
        </div>
      )}
      <div 
        ref={paypalRef} 
        className={`paypal-button-container w-full ${isLoading ? 'hidden' : ''}`} 
        id="paypal-button-container"
      />
    </div>
  );
}