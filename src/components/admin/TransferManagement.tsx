import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TransferManagement = () => {
  const [transfers, setTransfers] = useState([
    {
      id: '1',
      title: 'Airport to Hotel Transfer',
      vehicleType: 'Economy Car',
      capacity: '1-3 passengers',
      price: 800,
      description: 'Comfortable airport pickup and drop-off service',
      route: 'Dubai Airport - Dubai Hotels',
      status: 'active'
    },
    {
      id: '2',
      title: 'City Tour Transfer',
      vehicleType: 'SUV',
      capacity: '4-6 passengers',
      price: 1200,
      description: 'Premium SUV for city tours and sightseeing',
      route: 'Dubai City - Tourist Spots',
      status: 'active'
    }
  ]);

  const [isAddingTransfer, setIsAddingTransfer] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    vehicleType: '',
    capacity: '',
    price: '',
    description: '',
    route: '',
    status: 'active'
  });

  const { toast } = useToast();

  const vehicleTypes = [
    'Economy Car',
    'Premium Car',
    'SUV',
    'Van',
    'Luxury Car',
    'Bus'
  ];

  const capacityOptions = [
    '1-3 passengers',
    '4-6 passengers',
    '7-12 passengers',
    '13-20 passengers',
    '20+ passengers'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransfer) {
      setTransfers(transfers.map(transfer => 
        transfer.id === editingTransfer.id 
          ? { ...transfer, ...formData, price: Number(formData.price) }
          : transfer
      ));
      toast({
        title: "Transfer Updated",
        description: "Transfer service has been updated successfully.",
      });
      setEditingTransfer(null);
    } else {
      const newTransfer = {
        id: Date.now().toString(),
        ...formData,
        price: Number(formData.price)
      };
      setTransfers([...transfers, newTransfer]);
      toast({
        title: "Transfer Added",
        description: "New transfer service has been added successfully.",
      });
      setIsAddingTransfer(false);
    }

    setFormData({
      title: '',
      vehicleType: '',
      capacity: '',
      price: '',
      description: '',
      route: '',
      status: 'active'
    });
  };

  const handleEdit = (transfer: any) => {
    setFormData({
      title: transfer.title,
      vehicleType: transfer.vehicleType,
      capacity: transfer.capacity,
      price: transfer.price.toString(),
      description: transfer.description,
      route: transfer.route,
      status: transfer.status
    });
    setEditingTransfer(transfer);
    setIsAddingTransfer(true);
  };

  const handleDelete = (id: string) => {
    setTransfers(transfers.filter(transfer => transfer.id !== id));
    toast({
      title: "Transfer Deleted",
      description: "Transfer service has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transfer Management</h2>
          <p className="text-gray-600">Manage airport transfers and transportation services</p>
        </div>
        <Button onClick={() => setIsAddingTransfer(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Transfer
        </Button>
      </div>

      {/* Add/Edit Transfer Form */}
      {isAddingTransfer && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTransfer ? 'Edit Transfer' : 'Add New Transfer'}</CardTitle>
            <CardDescription>
              {editingTransfer ? 'Update transfer information' : 'Create a new transfer service'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Transfer Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Airport to Hotel Transfer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicleType} 
                    onValueChange={(value) => setFormData({...formData, vehicleType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Select 
                    value={formData.capacity} 
                    onValueChange={(value) => setFormData({...formData, capacity: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      {capacityOptions.map((capacity) => (
                        <SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="800"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="route">Route</Label>
                  <Input
                    id="route"
                    value={formData.route}
                    onChange={(e) => setFormData({...formData, route: e.target.value})}
                    placeholder="Dubai Airport - Dubai Hotels"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the transfer service..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingTransfer ? 'Update Transfer' : 'Add Transfer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingTransfer(false);
                    setEditingTransfer(null);
                    setFormData({
                      title: '',
                      vehicleType: '',
                      capacity: '',
                      price: '',
                      description: '',
                      route: '',
                      status: 'active'
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Transfers List */}
      <div className="grid gap-4">
        {transfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{transfer.title}</h3>
                      <Badge variant={transfer.status === 'active' ? 'default' : 'secondary'}>
                        {transfer.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{transfer.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Vehicle:</span> {transfer.vehicleType}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span> {transfer.capacity}
                      </div>
                      <div>
                        <span className="font-medium">Route:</span> {transfer.route}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ₹{transfer.price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(transfer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(transfer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {transfers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transfers found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first transfer service.</p>
            <Button onClick={() => setIsAddingTransfer(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transfer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransferManagement;