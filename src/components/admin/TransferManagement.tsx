
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X, Car } from 'lucide-react';

const TransferManagement = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransfer, setEditingTransfer] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast({
        title: "Error",
        description: "Failed to load transfers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transfer: any) => {
    setEditingTransfer(transfer);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTransfer({
      title: '',
      description: '',
      overview: '',
      base_price: 0,
      price_per_km: 0,
      price_per_hour: 0,
      vehicle_type: '',
      max_passengers: 4,
      distance_km: 0,
      duration_minutes: 0,
      pickup_locations: [],
      dropoff_locations: [],
      features: [],
      amenities: [],
      available_hours: ['00:00', '23:59'],
      is_featured: false,
      status: 'active',
      featured_image: '',
      advance_booking_hours: 2
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTransfer) return;

    setSaving(true);
    try {
      let query;
      if (editingTransfer.id) {
        query = supabase
          .from('transfers')
          .update(editingTransfer)
          .eq('id', editingTransfer.id);
      } else {
        query = supabase
          .from('transfers')
          .insert([editingTransfer]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({
        title: "Success",
        description: editingTransfer.id ? "Transfer updated successfully" : "Transfer created successfully",
      });

      setIsDialogOpen(false);
      setEditingTransfer(null);
      fetchTransfers();
    } catch (error) {
      console.error('Error saving transfer:', error);
      toast({
        title: "Error",
        description: "Failed to save transfer",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transferId: string) => {
    if (!confirm('Are you sure you want to delete this transfer?')) return;

    try {
      const { error } = await supabase
        .from('transfers')
        .delete()
        .eq('id', transferId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transfer deleted successfully",
      });

      fetchTransfers();
    } catch (error) {
      console.error('Error deleting transfer:', error);
      toast({
        title: "Error",
        description: "Failed to delete transfer",
        variant: "destructive",
      });
    }
  };

  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setEditingTransfer((prev: any) => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading transfers...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Transfer Management
        </CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Transfer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{transfer.title}</h3>
                <p className="text-sm text-gray-600 truncate">{transfer.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">AED {transfer.base_price}</span>
                  <Badge variant={transfer.status === 'active' ? 'default' : 'secondary'}>
                    {transfer.status}
                  </Badge>
                  {transfer.is_featured && <Badge variant="outline">Featured</Badge>}
                  {transfer.vehicle_type && <Badge variant="outline">{transfer.vehicle_type}</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(transfer)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(transfer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTransfer?.id ? 'Edit Transfer' : 'Create New Transfer'}
              </DialogTitle>
            </DialogHeader>
            
            {editingTransfer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={editingTransfer.title}
                      onChange={(e) => setEditingTransfer({...editingTransfer, title: e.target.value})}
                      placeholder="Enter transfer title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Input
                      id="vehicle_type"
                      value={editingTransfer.vehicle_type}
                      onChange={(e) => setEditingTransfer({...editingTransfer, vehicle_type: e.target.value})}
                      placeholder="e.g., Sedan, SUV, Van"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingTransfer.description || ''}
                    onChange={(e) => setEditingTransfer({...editingTransfer, description: e.target.value})}
                    placeholder="Enter transfer description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="base_price">Base Price (AED) *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      value={editingTransfer.base_price}
                      onChange={(e) => setEditingTransfer({...editingTransfer, base_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_passengers">Max Passengers</Label>
                    <Input
                      id="max_passengers"
                      type="number"
                      value={editingTransfer.max_passengers}
                      onChange={(e) => setEditingTransfer({...editingTransfer, max_passengers: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="advance_booking_hours">Advance Booking (Hours)</Label>
                    <Input
                      id="advance_booking_hours"
                      type="number"
                      value={editingTransfer.advance_booking_hours}
                      onChange={(e) => setEditingTransfer({...editingTransfer, advance_booking_hours: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickup_locations">Pickup Locations (one per line)</Label>
                  <Textarea
                    id="pickup_locations"
                    value={editingTransfer.pickup_locations?.join('\n') || ''}
                    onChange={(e) => handleArrayFieldChange('pickup_locations', e.target.value)}
                    placeholder="Dubai Airport&#10;Dubai Mall&#10;Burj Khalifa"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="dropoff_locations">Dropoff Locations (one per line)</Label>
                  <Textarea
                    id="dropoff_locations"
                    value={editingTransfer.dropoff_locations?.join('\n') || ''}
                    onChange={(e) => handleArrayFieldChange('dropoff_locations', e.target.value)}
                    placeholder="Hotels&#10;Airports&#10;Shopping Malls"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={editingTransfer.features?.join('\n') || ''}
                    onChange={(e) => handleArrayFieldChange('features', e.target.value)}
                    placeholder="Air conditioning&#10;Professional driver&#10;24/7 service"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={editingTransfer.featured_image || ''}
                    onChange={(e) => setEditingTransfer({...editingTransfer, featured_image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={editingTransfer.is_featured}
                    onCheckedChange={(checked) => setEditingTransfer({...editingTransfer, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">Featured Transfer</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Transfer'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TransferManagement;
