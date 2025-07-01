
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
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const PackageManagement = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const { data: packages, isLoading, refetch } = useQuery({
    queryKey: ['admin_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading packages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tour Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages?.map((pkg) => (
                  <div key={pkg.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{pkg.title}</h4>
                      <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                        {pkg.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.days} Days / {pkg.nights} Nights</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(pkg.price_adult)}</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Create New Package</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">Package Title</Label>
                  <Input id="title" placeholder="Enter package title" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="days">Days</Label>
                    <Input id="days" type="number" placeholder="Number of days" />
                  </div>
                  <div>
                    <Label htmlFor="nights">Nights</Label>
                    <Input id="nights" type="number" placeholder="Number of nights" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_adult">Adult Price</Label>
                    <Input id="price_adult" type="number" placeholder="Adult price" />
                  </div>
                  <div>
                    <Label htmlFor="price_child">Child Price</Label>
                    <Input id="price_child" type="number" placeholder="Child price" />
                  </div>
                  <div>
                    <Label htmlFor="price_infant">Infant Price</Label>
                    <Input id="price_infant" type="number" placeholder="Infant price" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter package description" />
                </div>
                
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PackageManagement;
