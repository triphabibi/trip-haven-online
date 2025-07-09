
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plane, Save } from 'lucide-react';

const OkToBoardManagement = () => {
  const [okToBoardService, setOkToBoardService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOkToBoardService();
  }, []);

  const fetchOkToBoardService = async () => {
    try {
      const { data, error } = await supabase
        .from('ok_to_board_services')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOkToBoardService(data);
      } else {
        // Create default service if none exists
        setOkToBoardService({
          title: 'Ok to Board Service',
          description: 'Professional Ok to Board verification service for UAE travelers',
          base_price: 2999,
          processing_fee: 199,
          processing_time: '48 hours',
          tax_rate: 0.18,
          is_active: true,
          requirements: [
            'Passport copy (first & last page)',
            'Valid visa (if applicable)',
            'Flight booking confirmation',
            'Submit 48 hours before flight'
          ],
          features: [
            'Complete Ok to Board verification',
            'Document validation and processing',
            'Airline coordination and confirmation',
            '24/7 support until boarding',
            'SMS/Email updates on status'
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching Ok to Board service:', error);
      toast({
        title: "Error",
        description: "Failed to load Ok to Board service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!okToBoardService) return;

    setSaving(true);
    try {
      let query;
      if (okToBoardService.id) {
        query = supabase
          .from('ok_to_board_services')
          .update(okToBoardService)
          .eq('id', okToBoardService.id);
      } else {
        query = supabase
          .from('ok_to_board_services')
          .insert([okToBoardService]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({
        title: "Success",
        description: "Ok to Board service updated successfully",
      });

      fetchOkToBoardService();
    } catch (error) {
      console.error('Error saving Ok to Board service:', error);
      toast({
        title: "Error",
        description: "Failed to save Ok to Board service",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setOkToBoardService((prev: any) => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading Ok to Board service...</div>;
  }

  if (!okToBoardService) {
    return <div className="text-center py-8">No Ok to Board service found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Ok to Board Service Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={okToBoardService.title}
                onChange={(e) => setOkToBoardService({...okToBoardService, title: e.target.value})}
                placeholder="Enter service title"
              />
            </div>
            <div>
              <Label htmlFor="processing_time">Processing Time</Label>
              <Input
                id="processing_time"
                value={okToBoardService.processing_time}
                onChange={(e) => setOkToBoardService({...okToBoardService, processing_time: e.target.value})}
                placeholder="e.g., 24-48 hours"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={okToBoardService.description || ''}
              onChange={(e) => setOkToBoardService({...okToBoardService, description: e.target.value})}
              placeholder="Enter service description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="base_price">Base Price (AED)</Label>
              <Input
                id="base_price"
                type="number"
                value={okToBoardService.base_price}
                onChange={(e) => setOkToBoardService({...okToBoardService, base_price: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="processing_fee">Processing Fee (AED)</Label>
              <Input
                id="processing_fee"
                type="number"
                value={okToBoardService.processing_fee}
                onChange={(e) => setOkToBoardService({...okToBoardService, processing_fee: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="tax_rate">Tax Rate (decimal)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                value={okToBoardService.tax_rate}
                onChange={(e) => setOkToBoardService({...okToBoardService, tax_rate: Number(e.target.value)})}
                placeholder="e.g., 0.18 for 18%"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={okToBoardService.requirements?.join('\n') || ''}
              onChange={(e) => handleArrayFieldChange('requirements', e.target.value)}
              placeholder="Passport copy (first & last page)&#10;Valid visa (if applicable)&#10;Flight booking confirmation"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="features">Service Features (one per line)</Label>
            <Textarea
              id="features"
              value={okToBoardService.features?.join('\n') || ''}
              onChange={(e) => handleArrayFieldChange('features', e.target.value)}
              placeholder="Complete Ok to Board verification&#10;Document validation and processing&#10;24/7 support until boarding"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={okToBoardService.is_active}
              onCheckedChange={(checked) => setOkToBoardService({...okToBoardService, is_active: checked})}
            />
            <Label htmlFor="is_active">Service Active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OkToBoardManagement;
