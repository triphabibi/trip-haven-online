
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Globe, Plus, Edit, Trash2, Save, X, CheckCircle, XCircle } from 'lucide-react';
import AIEnhancedForm from './AIEnhancedForm';
import { useCurrency } from '@/hooks/useCurrency';

const EnhancedVisaManagement = () => {
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [editingVisa, setEditingVisa] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: visas, isLoading } = useQuery({
    queryKey: ['admin_visas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: applications } = useQuery({
    queryKey: ['visa_bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('service_type', 'visa')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (visaData: any) => {
      if (visaData.id) {
        const { error } = await supabase
          .from('visa_services')
          .update(visaData)
          .eq('id', visaData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('visa_services')
          .insert([visaData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visas'] });
      toast({
        title: "Success",
        description: editingVisa?.id ? "Visa service updated successfully" : "Visa service created successfully",
      });
      setIsDialogOpen(false);
      setEditingVisa(null);
    },
    onError: (error) => {
      console.error('Error saving visa:', error);
      toast({
        title: "Error",
        description: "Failed to save visa service",
        variant: "destructive",
      });
    }
  });

  const updateApplicationStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          booking_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${status}`,
      });

      queryClient.invalidateQueries({ queryKey: ['visa_bookings'] });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    setEditingVisa({
      country: '',
      visa_type: 'tourist',
      description: '',
      price: 0,
      processing_time: '',
      requirements: [],
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (visa: any) => {
    setEditingVisa({ ...visa });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingVisa) return;
    setSaving(true);
    saveMutation.mutate(editingVisa);
    setSaving(false);
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditingVisa((prev: any) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading visa services...</div>
        </CardContent>
      </Card>
    );
  }

  const formFields = [
    {
      key: 'country',
      label: 'Country',
      type: 'input' as const,
      required: true,
      placeholder: 'Enter country name'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
      aiType: 'description',
      placeholder: 'Enter visa description',
      rows: 4
    },
    {
      key: 'processing_time',
      label: 'Processing Time',
      type: 'input' as const,
      placeholder: 'e.g., 5-7 business days'
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Visa Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications?.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{application.customer_name}</h4>
                        <p className="text-sm text-gray-600">
                          {application.service_title}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.booking_status)}>
                        {application.booking_status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2">{application.customer_email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2">{application.customer_phone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, 'completed')}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
                
                {applications?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No visa applications found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Visa Services</CardTitle>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visas?.map((visa) => (
                  <div key={visa.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{visa.country}</h4>
                      <Badge variant={visa.status === 'active' ? 'default' : 'secondary'}>
                        {visa.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{visa.visa_type}</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(visa.price)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(visa)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Visa Service</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreate} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Visa Service
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVisa?.id ? 'Edit Visa Service' : 'Create New Visa Service'}
            </DialogTitle>
          </DialogHeader>
          
          {editingVisa && (
            <div className="space-y-6">
              <AIEnhancedForm
                title="Visa Service Information"
                fields={formFields}
                data={editingVisa}
                onChange={handleFieldChange}
              >
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Visa Type</label>
                    <select
                      className="w-full mt-1 p-2 border rounded"
                      value={editingVisa.visa_type}
                      onChange={(e) => handleFieldChange('visa_type', e.target.value)}
                    >
                      <option value="tourist">Tourist Visa</option>
                      <option value="business">Business Visa</option>
                      <option value="transit">Transit Visa</option>
                      <option value="student">Student Visa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded"
                      value={editingVisa.price}
                      onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                    />
                  </div>
                </div>
              </AIEnhancedForm>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Visa Service'}
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
    </div>
  );
};

export default EnhancedVisaManagement;
