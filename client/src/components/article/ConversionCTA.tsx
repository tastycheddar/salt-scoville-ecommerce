import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Clock, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  short_description?: string;
  stock_quantity?: number;
}

interface ConversionCTAProps {
  primaryProduct?: Product;
  urgency?: boolean;
}

const ConversionCTA = ({ primaryProduct, urgency = false }: ConversionCTAProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    if (!urgency) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [urgency]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = async () => {
    if (!primaryProduct) return;

    try {
      // The addToCart function expects a full product object, not a cart item
      await addToCart(primaryProduct, 1);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!primaryProduct) {
    return (
      <Card className="bg-gradient-to-br from-flame-red/20 to-spice-orange/20 backdrop-blur-xl border-flame-red/30">
        <CardHeader>
          <CardTitle className="text-white text-center">
            <Zap className="h-6 w-6 inline mr-2" />
            Spice Up Your Kitchen!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-white/80 mb-4">
            Discover our premium collection of artisanal hot sauces and gourmet spice blends.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="w-full bg-flame-red hover:bg-flame-red/80 text-white font-semibold"
          >
            Shop All Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-flame-red/20 to-spice-orange/20 backdrop-blur-xl border-flame-red/30 sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-center">
          <Star className="h-5 w-5 inline mr-2 text-spice-orange" />
          Featured Product
        </CardTitle>
        
        {urgency && timeLeft > 0 && (
          <div className="bg-flame-red/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center text-white mb-1">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            <div className="text-2xl font-bold text-spice-orange">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Product Image */}
        <div 
          className="relative overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => navigate(`/products/${primaryProduct.id}`)}
        >
          <img
            src={primaryProduct.images[0] || '/placeholder.svg'}
            alt={primaryProduct.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-char-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Product Info */}
        <div className="space-y-3">
          <h3 
            className="font-bold text-white text-lg leading-tight cursor-pointer hover:text-spice-orange transition-colors"
            onClick={() => navigate(`/products/${primaryProduct.id}`)}
          >
            {primaryProduct.name}
          </h3>
          
          {primaryProduct.short_description && (
            <p className="text-white/70 text-sm leading-relaxed">
              {primaryProduct.short_description}
            </p>
          )}
          
          {/* Urgency Indicators */}
          {primaryProduct.stock_quantity && primaryProduct.stock_quantity <= 10 && (
            <div className="bg-flame-red/20 border border-flame-red/40 rounded-lg p-2">
              <p className="text-flame-red text-sm font-medium">
                ⚡ Only {primaryProduct.stock_quantity} left in stock!
              </p>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-spice-orange">
              ${primaryProduct.price.toFixed(2)}
            </div>
            <div className="text-white/60 text-sm line-through">
              ${(primaryProduct.price * 1.3).toFixed(2)}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-flame-red hover:bg-flame-red/80 text-white font-semibold text-lg py-3"
              disabled={primaryProduct.stock_quantity === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              onClick={() => navigate(`/products/${primaryProduct.id}`)}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              View Details
            </Button>
          </div>
          
          {/* Trust Signals */}
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-spice-orange font-semibold">Free Shipping</div>
                <div className="text-white/60 text-xs">Orders over $50</div>
              </div>
              <div>
                <div className="text-spice-orange font-semibold">Satisfaction</div>
                <div className="text-white/60 text-xs">Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionCTA;