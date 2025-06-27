
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Plane, Car, FileText, Ticket } from 'lucide-react';
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
    { name: 'Transfers', href: '/transfers', icon: Car },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              TripHabibi
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="text-2xl font-bold text-blue-600 mb-8">
                    TripHabibi
                  </Link>
                  
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-2">
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start">
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
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
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
