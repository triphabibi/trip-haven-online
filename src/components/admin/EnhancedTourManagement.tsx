
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import AIEnhancedForm from './AIEnhancedForm';
import { useCurrency } from '@/hooks/useCurrency';

const EnhancedTourManagement = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: toursData, isLoading } = useQuery({
    queryKey: ['admin_tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (toursData) {
      setTours(toursData);
    }
  }, [toursData]);

  const saveMutation = useMutation({
    mutationFn: async (tourData: any) => {
      if (tourData.id) {
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tourData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tours')
          .insert([tourData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tours'] });
      toast({
        title: "Success",
        description: editingTour?.id ? "Tour updated successfully" : "Tour created successfully",
      });
      setIsDialogOpen(false);
      setEditingTour(null);
    },
    onError: (error) => {
      console.error('Error saving tour:', error);
      toast({
        title: "Error",
        description: "Failed to save tour",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (tourId: string) => {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tours'] });
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting tour:', error);
      toast({
        title: "Error",
        description: "Failed to delete tour",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (tour: any) => {
    setEditingTour({ ...tour });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTour({
      title: '',
      description: '',
      overview: '',
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      duration: '',
      is_featured: false,
      status: 'active',
      highlights: [],
      whats_included: [],
      whats_excluded: [],
      image_urls: [],
      video_url: ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingTour) return;
    setSaving(true);
    saveMutation.mutate(editingTour);
    setSaving(false);
  };

  const handleDelete = (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    deleteMutation.mutate(tourId);
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditingTour((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tours...</div>;
  }

  const formFields = [
    {
      key: 'title',
      label: 'Tour Title',
      type: 'input' as const,
      aiType: 'title',
      required: true,
      placeholder: 'Enter tour title'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
      aiType: 'description',
      placeholder: 'Enter tour description',
      rows: 4
    },
    {
      key: 'overview',
      label: 'Overview',
      type: 'textarea' as const,
      aiType: 'overview',
      placeholder: 'Enter tour overview',
      rows: 3
    },
    {
      key: 'duration',
      label: 'Duration',
      type: 'input' as const,
      placeholder: 'e.g., Full Day, 4 Hours'
    },
    {
      key: 'video_url',
      label: 'YouTube Video URL',
      type: 'input' as const,
      placeholder: 'https://www.youtube.com/watch?v=...'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enhanced Tour Management</CardTitle>
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
                  <span className="text-sm">{formatPrice(tour.price_adult)}</span>
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
                <Button size="sm" variant="outline" onClick={() => handleDelete(tour.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTour?.id ? 'Edit Tour' : 'Create New Tour'}
              </DialogTitle>
            </DialogHeader>
            
            {editingTour && (
              <div className="space-y-6">
                <AIEnhancedForm
                  title="Tour Information"
                  fields={formFields}
                  data={editingTour}
                  onChange={handleFieldChange}
                >
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">Adult Price *</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded"
                        value={editingTour.price_adult}
                        onChange={(e) => handleFieldChange('price_adult', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Child Price</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded"
                        value={editingTour.price_child}
                        onChange={(e) => handleFieldChange('price_child', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Infant Price</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded"
                        value={editingTour.price_infant}
                        onChange={(e) => handleFieldChange('price_infant', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={editingTour.is_featured}
                      onChange={(e) => handleFieldChange('is_featured', e.target.checked)}
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured Tour</label>
                  </div>
                </AIEnhancedForm>

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

export default EnhancedTourManagement;
