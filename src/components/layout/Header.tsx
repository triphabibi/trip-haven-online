import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  MapPin, 
  Plane,
  Calendar,
  Ticket,
  FileText,
  Shield,
  Briefcase,
  Star,
  ChevronDown,
  Car,
  Search
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { 
      name: 'Tours', 
      href: '/tours', 
      icon: MapPin,
      description: 'Discover amazing destinations'
    },
    { 
      name: 'Packages', 
      href: '/packages', 
      icon: Briefcase,
      description: 'Complete travel packages'
    },
    { 
      name: 'Umrah', 
      href: '/umrah', 
      icon: Star,
      description: 'Sacred spiritual journeys'
    },
    { 
      name: 'Visa', 
      href: '/visa', 
      icon: FileText,
      description: 'Visa assistance services'
    },
    { 
      name: 'Tickets', 
      href: '/tickets', 
      icon: Ticket,
      description: 'Attraction & event tickets'
    },
    { 
      name: 'Transfers', 
      href: '/transfers', 
      icon: Car,
      description: 'Airport & city transfers'
    },
    { 
      name: 'OK to Board', 
      href: '/ok-to-board', 
      icon: Shield,
      description: 'Travel authorization'
    },
  ];

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-2 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                TripHabibi
              </span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {user && (
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  to="/booking-history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNavigation = () => (
    <nav className="hidden md:flex items-center space-x-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`relative group px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isActive(item.href)
                ? 'text-primary bg-primary/10 shadow-lg'
                : 'text-gray-600 hover:text-primary hover:bg-primary/5'
            }`}
            style={{
              transform: isScrolled ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.name}</span>
            </div>
            
            {/* 3D Hover Effect */}
            <div 
              className={`absolute inset-0 rounded-lg transition-all duration-300 -z-10 ${
                isActive(item.href) 
                  ? 'bg-gradient-to-r from-primary/20 to-blue-500/20 shadow-xl'
                  : 'bg-gradient-to-r from-primary/0 to-blue-500/0 group-hover:from-primary/10 group-hover:to-blue-500/10 group-hover:shadow-lg'
              }`}
              style={{
                transform: 'translateZ(-1px) rotateX(5deg)',
                filter: 'blur(0.5px)',
              }}
            />
            
            {/* Animated underline */}
            <div 
              className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 ${
                isActive(item.href) 
                  ? 'w-full -translate-x-1/2' 
                  : 'w-0 group-hover:w-full group-hover:-translate-x-1/2'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      style={{
        transform: isScrolled ? 'translateY(0)' : 'translateY(0)',
        boxShadow: isScrolled ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div 
              className="bg-gradient-to-r from-primary to-blue-600 text-white p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{
                boxShadow: isScrolled ? '0 10px 20px rgba(59, 130, 246, 0.3)' : '0 5px 15px rgba(59, 130, 246, 0.2)',
              }}
            >
              <MapPin className="h-6 w-6" />
            </div>
            <span 
              className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300"
              style={{
                filter: isScrolled ? 'brightness(1.1)' : 'brightness(1)',
              }}
            >
              TripHabibi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Track Booking Button */}
          <div className="hidden md:block">
            <Link to="/booking-tracker">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                style={{
                  transform: isScrolled ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                <Search className="h-4 w-4" />
                Track Booking
              </Button>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 px-3 py-2 transition-all duration-300 hover:scale-105"
                        style={{
                          transform: isScrolled ? 'translateY(-1px)' : 'translateY(0)',
                        }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.email?.[0]?.toUpperCase()}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <div className="font-medium">User</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/booking-history" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/admin" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Admin Panel
                          <Badge variant="secondary" className="ml-auto">Admin</Badge>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="transition-all duration-300 hover:scale-105"
                    style={{
                      transform: isScrolled ? 'translateY(-1px)' : 'translateY(0)',
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 hover:scale-105"
                    style={{
                      transform: isScrolled ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: isScrolled ? '0 8px 16px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
