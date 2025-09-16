
import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WholesaleCartSummary from '@/components/cart/WholesaleCartSummary';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { logger } from '@/utils/logger';
import { ImageUtils } from '@/utils/imageUtils';
import { getAmountNeededForFreeShipping, calculateShipping } from '@/utils/shippingCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      logger.error('Failed to update quantity in cart drawer', { error, productId, newQuantity }, 'CartDrawer');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      logger.error('Failed to remove item from cart drawer', { error, productId }, 'CartDrawer');
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-white dark:bg-char-black w-full sm:max-w-lg">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-char-black dark:text-white font-im-fell">
              Shopping Cart
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="text-char-black dark:text-white hover:text-flame-red">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription className="sr-only">
            Review and manage items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Updating cart..." />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-char-black dark:text-white mb-2">Your cart is empty</h3>
              <p className="text-charcoal/60 dark:text-gray-400">Add some spicy products to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const imageUrl = ImageUtils.validateImageUrl(item.image);

                return (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={imageUrl}
                      alt="Spicy Salt & Scoville Micro Salt #FlavorHack"
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      onError={ImageUtils.createImageErrorHandler(item.id, item.image || '', 'CartDrawer')}
                      loading="lazy"
                    />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-char-black dark:text-white font-montserrat">{item.name}</h4>
                    <p className="text-flame-red font-bold">${(item.price || 0).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityUpdate(item.product_id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="font-medium text-char-black dark:text-white min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityUpdate(item.product_id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                );
              })}

              <div className="border-t border-gray-200 pt-6">
                <WholesaleCartSummary />
                
                {(() => {
                  const totalPrice = getTotalPrice();
                  const shippingCalculation = calculateShipping(cartItems, 'US');
                  const amountNeeded = getAmountNeededForFreeShipping(totalPrice, 'US');
                  
                  return (
                    <>
                      {!shippingCalculation.isFree && amountNeeded > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <p className="text-char-black dark:text-white text-sm text-center">
                            Add ${amountNeeded.toFixed(2)} more for FREE shipping!
                          </p>
                        </div>
                      )}
                      {shippingCalculation.isFree && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <p className="text-char-black dark:text-white text-sm text-center">
                            🎉 You qualify for FREE shipping!
                            {shippingCalculation.savings && ` You saved $${shippingCalculation.savings.toFixed(2)}!`}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-char-black dark:text-white font-montserrat">
                          Total: ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </>
                  );
                })()}

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-char-black hover:bg-flame-red text-white font-medium py-3 font-montserrat"
                  disabled={isLoading || cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
