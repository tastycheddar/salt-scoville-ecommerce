
import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || null,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      if (result.alreadySubscribed) {
        toast({
          title: 'Already subscribed!',
          description: 'This email is already subscribed to our newsletter.',
          variant: 'default',
        });
      } else if (result.reactivated) {
        toast({
          title: 'Welcome back!',
          description: 'Your subscription has been reactivated.',
        });
        setIsSubscribed(true);
      } else {
        toast({
          title: 'Successfully subscribed!',
          description: 'Welcome to the Salt & Scoville elite. Get ready for the heat!',
        });
        setIsSubscribed(true);
      }
      
      setEmail('');
      setFirstName('');
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast({
        title: 'Subscription failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-flame-red relative overflow-hidden">
      {/* Salt Crystal Background */}
      <div className="absolute inset-0 salt-texture opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-16 w-16 text-white mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            UNLOCK THE ARSENAL
          </h2>
          
          <p className="text-xl text-white/90 mb-8">
            Exclusive limited edition flavor drops, underground recipes, and heat challenges that separate the bold from the basic.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
              <span className="text-white text-lg font-medium">You're in! Welcome to the elite.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white"
                />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white"
                  required
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-char-black hover:bg-charcoal text-white px-8 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Joining...' : 'Join VIP'}
              </Button>
            </form>
          )}

          <p className="text-white/70 text-sm mt-4">
            Welcome to your new addiction...
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
