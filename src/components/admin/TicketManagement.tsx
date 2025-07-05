
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const TicketManagement = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const { data: tickets, isLoading, refetch } = useQuery({
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
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Attraction Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets?.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{ticket.title}</h4>
                        <Badge variant={ticket.status === 'active' ? 'default' : 'secondary'}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.location}</p>
                      <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(ticket.price_adult)}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
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
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Create New Ticket</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter ticket title" className="bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Enter location" className="bg-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_adult">Adult Price</Label>
                      <Input id="price_adult" type="number" placeholder="Adult price" className="bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="price_child">Child Price</Label>
                      <Input id="price_child" type="number" placeholder="Child price" className="bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="price_infant">Infant Price</Label>
                      <Input id="price_infant" type="number" placeholder="Infant price" className="bg-white" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter ticket description" className="bg-white" />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
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
