
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Users, Package, Ticket, CreditCard, TrendingUp, Plus, Edit, Trash } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [tours, setTours] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [
        usersCount,
        bookingsData,
        toursData,
        packagesData,
        ticketsData,
        slidersData
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('new_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('tours').select('*').order('created_at', { ascending: false }),
        supabase.from('tour_packages').select('*').order('created_at', { ascending: false }),
        supabase.from('attraction_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('homepage_sliders').select('*').order('display_order', { ascending: true }),
      ]);

      const totalRevenue = bookingsData.data?.reduce((sum, booking) => sum + Number(booking.final_amount || 0), 0) || 0;
      const pendingBookings = bookingsData.data?.filter(b => b.booking_status === 'pending').length || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue,
        pendingBookings,
      });

      setTours(toursData.data || []);
      setPackages(packagesData.data || []);
      setTickets(ticketsData.data || []);
      setSliders(slidersData.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = async (table: string, id: string, currentStatus: boolean, statusField: string = 'status') => {
    try {
      const updateData = statusField === 'status' 
        ? { status: currentStatus === true || currentStatus === 'active' ? 'inactive' : 'active' }
        : { [statusField]: !currentStatus };

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item status updated successfully",
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setEditingType(type);
  };

  const handleSave = async () => {
    if (!editingItem || !editingType) return;

    try {
      const { error } = await supabase
        .from(editingType)
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      setEditingItem(null);
      setEditingType('');
      fetchAdminData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const renderEditModal = () => {
    if (!editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Edit {editingType}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
              />
            </div>
            
            {editingType !== 'homepage_sliders' && (
              <div>
                <Label htmlFor="price">Price (Adult)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingItem.price_adult || editingItem.price || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    [editingItem.price_adult !== undefined ? 'price_adult' : 'price']: Number(e.target.value)
                  })}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={editingItem.is_featured || false}
                onCheckedChange={(checked) => setEditingItem({...editingItem, is_featured: checked})}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => {setEditingItem(null); setEditingType('')}}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContentTable = (items: any[], type: string, columns: string[]) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{item.title || item.country}</p>
            <p className="text-sm text-gray-600">
              {type === 'homepage_sliders' ? `Order: ${item.display_order}` : 
               `Price: ₹${item.price_adult || item.price || 0}`}
            </p>
            {item.location && <p className="text-sm text-gray-500">{item.location}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={
              (item.status === 'active' || item.is_active) ? 'bg-green-500' : 'bg-gray-500'
            }>
              {(item.status === 'active' || item.is_active) ? 'Active' : 'Inactive'}
            </Badge>
            {item.is_featured && <Badge className="bg-yellow-500">Featured</Badge>}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleEdit(item, type)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => toggleItemStatus(
                type, 
                item.id, 
                item.status || item.is_active,
                type === 'homepage_sliders' ? 'is_active' : 'status'
              )}
            >
              {(item.status === 'active' || item.is_active) ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading admin dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your travel business content</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="tours" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
            <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
            <TabsTrigger value="tickets">Tickets ({tickets.length})</TabsTrigger>
            <TabsTrigger value="sliders">Sliders ({sliders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tours">
            <Card>
              <CardHeader>
                <CardTitle>Tours Management</CardTitle>
                <CardDescription>Manage your tour offerings</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentTable(tours, 'tours', ['title', 'price_adult', 'status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Tour Packages Management</CardTitle>
                <CardDescription>Manage your tour packages</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentTable(packages, 'tour_packages', ['title', 'price_adult', 'status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Attraction Tickets Management</CardTitle>
                <CardDescription>Manage your attraction tickets</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentTable(tickets, 'attraction_tickets', ['title', 'price_adult', 'status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sliders">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Sliders Management</CardTitle>
                <CardDescription>Manage your homepage carousel</CardDescription>
              </CardHeader>
              <CardContent>
                {renderContentTable(sliders, 'homepage_sliders', ['title', 'display_order', 'is_active'])}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {renderEditModal()}
      <Footer />
    </div>
  );
};

export default AdminPage;
