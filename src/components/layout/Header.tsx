
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Plane, Car, FileText, Ticket, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Tours', href: '/tours', icon: Plane },
    { name: 'Packages', href: '/packages', icon: FileText },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Visas', href: '/visas', icon: FileText },
    { name: 'Ok to Board', href: '/ok-to-board', icon: Plane },
    { name: 'Transfers', href: '/transfers', icon: Car },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600 hover:scale-105 transition-transform duration-300">
              TripHabibi
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105 relative group ${
                    isActive 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="h-10 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 h-10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="flex items-center gap-2 h-10">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-l border-gray-200">
                <nav className="flex flex-col space-y-6 mt-8">
                  <Link to="/" className="text-2xl font-bold text-blue-600 mb-8">
                    TripHabibi
                  </Link>
                  
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = window.location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center gap-4 font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'text-blue-600 bg-blue-50 font-semibold' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  <div className="pt-6 border-t">
                    {user ? (
                      <div className="space-y-3">
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start h-12">
                              <Settings className="h-5 w-5 mr-3" />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                          className="w-full justify-start h-12"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start h-12">
                          <User className="h-5 w-5 mr-3" />
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
