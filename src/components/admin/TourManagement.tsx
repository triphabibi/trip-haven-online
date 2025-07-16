
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
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const TourManagement = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: "Error",
        description: "Failed to load tours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tour: any) => {
    setEditingTour(tour);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTour({
      title: '',
      description: '',
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      duration: '',
      is_featured: false,
      status: 'active',
      highlights: [],
      whats_included: [],
      image_urls: [],
      video_url: ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTour) return;

    setSaving(true);
    try {
      let query;
      if (editingTour.id) {
        // Update existing tour
        query = supabase
          .from('tours')
          .update(editingTour)
          .eq('id', editingTour.id);
      } else {
        // Create new tour
        query = supabase
          .from('tours')
          .insert([editingTour]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({
        title: "Success",
        description: editingTour.id ? "Tour updated successfully" : "Tour created successfully",
      });

      setIsDialogOpen(false);
      setEditingTour(null);
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: "Error",
        description: "Failed to save tour",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });

      fetchTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast({
        title: "Error",
        description: "Failed to delete tour",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (tour: any) => {
    try {
      const newStatus = tour.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tour.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tour status updated successfully",
      });

      fetchTours();
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        title: "Error",
        description: "Failed to update tour status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tours...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tour Management</CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tour
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tours.map((tour) => (
            <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{tour.title}</h3>
                <p className="text-sm text-gray-600 truncate">{tour.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">₹{tour.price_adult}</span>
                  <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                    {tour.status}
                  </Badge>
                  {tour.is_featured && <Badge variant="outline">Featured</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(tour)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(tour)}>
                  {tour.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(tour.id)}>
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
                {editingTour?.id ? 'Edit Tour' : 'Create New Tour'}
              </DialogTitle>
            </DialogHeader>
            
            {editingTour && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={editingTour.title}
                    onChange={(e) => setEditingTour({...editingTour, title: e.target.value})}
                    placeholder="Enter tour title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingTour.description || ''}
                    onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                    placeholder="Enter tour description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_adult">Adult Price *</Label>
                    <Input
                      id="price_adult"
                      type="number"
                      value={editingTour.price_adult}
                      onChange={(e) => setEditingTour({...editingTour, price_adult: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_child">Child Price</Label>
                    <Input
                      id="price_child"
                      type="number"
                      value={editingTour.price_child}
                      onChange={(e) => setEditingTour({...editingTour, price_child: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_infant">Infant Price</Label>
                    <Input
                      id="price_infant"
                      type="number"
                      value={editingTour.price_infant}
                      onChange={(e) => setEditingTour({...editingTour, price_infant: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={editingTour.duration || ''}
                    onChange={(e) => setEditingTour({...editingTour, duration: e.target.value})}
                    placeholder="e.g., Full Day, 4 Hours"
                  />
                </div>

                <div>
                  <Label htmlFor="video_url">YouTube Video URL</Label>
                  <Input
                    id="video_url"
                    value={editingTour.video_url || ''}
                    onChange={(e) => setEditingTour({...editingTour, video_url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <Label htmlFor="image_urls">Image URLs (one per line)</Label>
                  <Textarea
                    id="image_urls"
                    value={Array.isArray(editingTour.image_urls) ? editingTour.image_urls.join('\n') : ''}
                    onChange={(e) => {
                      const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                      setEditingTour({...editingTour, image_urls: urls});
                    }}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Enter up to 5 image URLs, one per line</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={editingTour.is_featured}
                    onCheckedChange={(checked) => setEditingTour({...editingTour, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">Featured Tour</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Tour'}
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

export default TourManagement;
