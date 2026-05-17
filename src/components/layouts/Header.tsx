import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Search, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useState } from 'react';


export function Header() {
  const { user, profile, signOut } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/products' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>

  <SheetContent side="left" className="w-64">

    {/* Hidden accessibility content */}
    <SheetHeader>
      <VisuallyHidden>
        <SheetTitle>Mobile Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <VisuallyHidden>
        <SheetDescription>
          Main navigation links for the website
        </SheetDescription>
      </VisuallyHidden>
    </SheetHeader>

    <nav className="flex flex-col gap-4 mt-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileMenuOpen(false)}
          className={`text-base font-medium transition-colors ${
            isActive(item.path)
              ? 'text-primary'
              : 'text-foreground hover:text-primary'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>

  </SheetContent>
</Sheet>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold text-foreground leading-tight">WORLD-SHOPE</div>
                <div className="text-xs text-muted-foreground leading-tight">PLATFORM</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 ml-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
                >
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>

{user ? (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <div className="px-2 py-1.5 text-sm font-medium">
        {profile?.username || 'User'}
      </div>
      <DropdownMenuSeparator />
      
      {/* --- Naya Account Settings Option --- */}
      <DropdownMenuItem onClick={() => navigate('/account')}>
        <User className="mr-2 h-4 w-4" />
        My Account
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/account/orders')}>
        <Package className="mr-2 h-4 w-4" />
        My Orders
      </DropdownMenuItem>

      {profile?.role === 'admin' && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </DropdownMenuItem>
        </>
      )}
      
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  <Button onClick={() => navigate('/login')} size="sm" variant="ghost">
    <User className="h-5 w-5" />
  </Button>
)}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0"
          />
        </form>
      </div>
    </header>
  );
}
