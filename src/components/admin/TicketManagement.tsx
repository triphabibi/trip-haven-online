
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const TicketManagement = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    overview: '',
    location: '',
    price_adult: 0,
    price_child: 0,
    price_infant: 0,
    highlights: [],
    whats_included: [],
    exclusions: [],
    languages: ['English'],
    available_times: [],
    featured_image: '',
    gallery_images: [],
    instant_confirmation: true,
    free_cancellation: true,
    instant_delivery: true,
    is_featured: false,
    status: 'active',
  });

  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin_tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attraction_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      const { data, error } = await supabase
        .from('attraction_tickets')
        .insert([ticketData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      toast({ title: "Success", description: "Ticket created successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, ...ticketData }: { id: string } & any) => {
      const { data, error } = await supabase
        .from('attraction_tickets')
        .update(ticketData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      toast({ title: "Success", description: "Ticket updated successfully" });
      setIsEditing(false);
      setSelectedTicket(null);
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attraction_tickets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tickets'] });
      toast({ title: "Success", description: "Ticket deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      overview: '',
      location: '',
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      highlights: [],
      whats_included: [],
      exclusions: [],
      languages: ['English'],
      available_times: [],
      featured_image: '',
      gallery_images: [],
      instant_confirmation: true,
      free_cancellation: true,
      instant_delivery: true,
      is_featured: false,
      status: 'active',
    });
    setIsEditing(false);
    setSelectedTicket(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedTicket) {
      updateTicketMutation.mutate({ id: selectedTicket.id, ...formData });
    } else {
      createTicketMutation.mutate(formData);
    }
  };

  const handleEdit = (ticket: any) => {
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title || '',
      slug: ticket.slug || '',
      description: ticket.description || '',
      overview: ticket.overview || '',
      location: ticket.location || '',
      price_adult: ticket.price_adult || 0,
      price_child: ticket.price_child || 0,
      price_infant: ticket.price_infant || 0,
      highlights: ticket.highlights || [],
      whats_included: ticket.whats_included || [],
      exclusions: ticket.exclusions || [],
      languages: ticket.languages || ['English'],
      available_times: ticket.available_times || [],
      featured_image: ticket.featured_image || '',
      gallery_images: ticket.gallery_images || [],
      instant_confirmation: ticket.instant_confirmation !== false,
      free_cancellation: ticket.free_cancellation !== false,
      instant_delivery: ticket.instant_delivery !== false,
      is_featured: ticket.is_featured || false,
      status: ticket.status || 'active',
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const addImageUrl = (field: 'gallery_images') => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), url]
      }));
    }
  };

  const removeImageUrl = (field: 'gallery_images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading tickets...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Tickets ({tickets?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Ticket' : 'Create New Ticket'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Attraction Tickets
              </CardTitle>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Ticket
              </Button>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets?.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold truncate">{ticket.title}</h4>
                      <div className="flex items-center gap-2">
                        {ticket.is_featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          ticket.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.location}</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(ticket.price_adult)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(ticket)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteTicketMutation.mutate(ticket.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="form">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Ticket' : 'Create New Ticket'}</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_adult">Adult Price *</Label>
                      <Input
                        id="price_adult"
                        type="number"
                        value={formData.price_adult}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_adult: Number(e.target.value) }))}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_child">Child Price</Label>
                      <Input
                        id="price_child"
                        type="number"
                        value={formData.price_child}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_child: Number(e.target.value) }))}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_infant">Infant Price</Label>
                      <Input
                        id="price_infant"
                        type="number"
                        value={formData.price_infant}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_infant: Number(e.target.value) }))}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="bg-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label>Gallery Images</Label>
                    <div className="space-y-2">
                      {formData.gallery_images.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <Input value={url} readOnly className="bg-gray-50" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageUrl('gallery_images', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addImageUrl('gallery_images')}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Add Gallery Image URL
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="highlights">Highlights (one per line)</Label>
                    <Textarea
                      id="highlights"
                      value={formData.highlights.join('\n')}
                      onChange={(e) => handleArrayFieldChange('highlights', e.target.value)}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whats_included">What's Included (one per line)</Label>
                    <Textarea
                      id="whats_included"
                      value={formData.whats_included.join('\n')}
                      onChange={(e) => handleArrayFieldChange('whats_included', e.target.value)}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="available_times">Available Times (one per line)</Label>
                    <Textarea
                      id="available_times"
                      value={formData.available_times.join('\n')}
                      onChange={(e) => handleArrayFieldChange('available_times', e.target.value)}
                      className="bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label htmlFor="is_featured">Featured Ticket</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                      />
                      <Label htmlFor="is_active">Published (Active)</Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <Button type="submit" disabled={createTicketMutation.isPending || updateTicketMutation.isPending}>
                      {createTicketMutation.isPending || updateTicketMutation.isPending ? 'Saving...' : (isEditing ? 'Update Ticket' : 'Create Ticket')}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TicketManagement;
