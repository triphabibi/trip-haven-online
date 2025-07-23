
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import AIEnhancedForm from './AIEnhancedForm';
import { useCurrency } from '@/hooks/useCurrency';

const UmrahManagement = () => {
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin_umrah_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('umrah_packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (packageData: any) => {
      if (packageData.id) {
        const { error } = await supabase
          .from('umrah_packages')
          .update(packageData)
          .eq('id', packageData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('umrah_packages')
          .insert([packageData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_umrah_packages'] });
      toast({
        title: "Success",
        description: editingPackage?.id ? "Umrah package updated successfully" : "Umrah package created successfully",
      });
      setIsDialogOpen(false);
      setEditingPackage(null);
    },
    onError: (error) => {
      console.error('Error saving umrah package:', error);
      toast({
        title: "Error",
        description: "Failed to save umrah package",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const { error } = await supabase
        .from('umrah_packages')
        .delete()
        .eq('id', packageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_umrah_packages'] });
      toast({
        title: "Success",
        description: "Umrah package deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting umrah package:', error);
      toast({
        title: "Error",
        description: "Failed to delete umrah package",
        variant: "destructive",
      });
    }
  });

  const handleCreate = () => {
    setEditingPackage({
      title: '',
      description: '',
      overview: '',
      price_per_person: 0,
      duration_days: 0,
      hotel_rating: 3,
      is_featured: false,
      status: 'active',
      inclusions: [],
      exclusions: [],
      itinerary: [],
      image_urls: []
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage({ ...pkg });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingPackage) return;
    setSaving(true);
    saveMutation.mutate(editingPackage);
    setSaving(false);
  };

  const handleDelete = (packageId: string) => {
    if (!confirm('Are you sure you want to delete this umrah package?')) return;
    deleteMutation.mutate(packageId);
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditingPackage((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading umrah packages...</div>;
  }

  const formFields = [
    {
      key: 'title',
      label: 'Package Title',
      type: 'input' as const,
      aiType: 'title',
      required: true,
      placeholder: 'Enter umrah package title'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
      aiType: 'description',
      placeholder: 'Enter package description',
      rows: 4
    },
    {
      key: 'overview',
      label: 'Overview',
      type: 'textarea' as const,
      aiType: 'overview',
      placeholder: 'Enter package overview',
      rows: 3
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Umrah Package Management
        </CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Package
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages?.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{pkg.title}</h3>
                <p className="text-sm text-gray-600 truncate">{pkg.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">{formatPrice(pkg.price_per_person)}</span>
                  <span className="text-sm text-gray-500">• {pkg.duration_days} days</span>
                  <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                    {pkg.status}
                  </Badge>
                  {pkg.is_featured && <Badge variant="outline">Featured</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {packages?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No umrah packages found. Create your first package to get started.
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage?.id ? 'Edit Umrah Package' : 'Create New Umrah Package'}
              </DialogTitle>
            </DialogHeader>
            
            {editingPackage && (
              <div className="space-y-6">
                <AIEnhancedForm
                  title="Package Information"
                  fields={formFields}
                  data={editingPackage}
                  onChange={handleFieldChange}
                >
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">Price Per Person *</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded"
                        value={editingPackage.price_per_person}
                        onChange={(e) => handleFieldChange('price_per_person', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration (Days)</label>
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border rounded"
                        value={editingPackage.duration_days}
                        onChange={(e) => handleFieldChange('duration_days', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hotel Rating</label>
                      <select
                        className="w-full mt-1 p-2 border rounded"
                        value={editingPackage.hotel_rating}
                        onChange={(e) => handleFieldChange('hotel_rating', Number(e.target.value))}
                      >
                        <option value={3}>3 Star</option>
                        <option value={4}>4 Star</option>
                        <option value={5}>5 Star</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={editingPackage.is_featured}
                      onChange={(e) => handleFieldChange('is_featured', e.target.checked)}
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured Package</label>
                  </div>
                </AIEnhancedForm>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Package'}
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

export default UmrahManagement;
