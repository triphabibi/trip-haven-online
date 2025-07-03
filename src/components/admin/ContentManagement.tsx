import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, Image as ImageIcon, Video, Menu, Globe } from 'lucide-react';

const ContentManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Point 12 & 13: Admin panel for slider, menu, footer management
  const [newSlider, setNewSlider] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: 'Learn More',
    link_url: '',
    display_order: 0,
    is_active: true
  });

  const [videoSettings, setVideoSettings] = useState({
    video_url: '',
    title: 'Experience Dubai Like Never Before',
    description: 'Watch our exclusive travel experiences'
  });

  const [trendingSettings, setTrendingSettings] = useState({
    item1_title: 'Desert Safari',
    item1_bookings: '47 people booked this in the last 24h',
    item2_title: 'Dubai City Tour',
    item2_bookings: '23 people booked this in the last 6h',
    show_count: 2
  });

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      setSliders(data || []);
    } catch (error) {
      console.error('Error loading sliders:', error);
    }
  };

  const saveSlider = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('homepage_sliders')
        .insert(newSlider);

      if (error) throw error;

      toast({
        title: "✅ Slider Added!",
        description: "Homepage slider has been updated successfully.",
      });

      setNewSlider({
        title: '',
        subtitle: '',
        image_url: '',
        button_text: 'Learn More',
        link_url: '',
        display_order: 0,
        is_active: true
      });

      loadSliders();
    } catch (error) {
      console.error('Error saving slider:', error);
      toast({
        title: "Error",
        description: "Failed to save slider.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSlider = async (id: string) => {
    try {
      const { error } = await supabase
        .from('homepage_sliders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "🗑️ Slider Deleted",
        description: "Slider has been removed.",
      });

      loadSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  const saveVideoSettings = async () => {
    try {
      // Save to site_settings table
      await supabase
        .from('site_settings')
        .upsert([
          { setting_key: 'video_url', setting_value: videoSettings.video_url },
          { setting_key: 'video_title', setting_value: videoSettings.title },
          { setting_key: 'video_description', setting_value: videoSettings.description }
        ]);

      toast({
        title: "📹 Video Settings Saved!",
        description: "Homepage video section updated.",
      });
    } catch (error) {
      console.error('Error saving video settings:', error);
    }
  };

  const saveTrendingSettings = async () => {
    try {
      await supabase
        .from('site_settings')
        .upsert([
          { setting_key: 'trending_item1_title', setting_value: trendingSettings.item1_title },
          { setting_key: 'trending_item1_bookings', setting_value: trendingSettings.item1_bookings },
          { setting_key: 'trending_item2_title', setting_value: trendingSettings.item2_title },
          { setting_key: 'trending_item2_bookings', setting_value: trendingSettings.item2_bookings },
          { setting_key: 'trending_show_count', setting_value: trendingSettings.show_count.toString() }
        ]);

      toast({
        title: "🔥 Trending Settings Saved!",
        description: "Trending section updated.",
      });
    } catch (error) {
      console.error('Error saving trending settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📝 Content Management</h1>
      </div>

      <Tabs defaultValue="sliders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sliders" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Sliders
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Menu className="h-4 w-4" />
            Menu/Footer
          </TabsTrigger>
        </TabsList>

        {/* Slider Management */}
        <TabsContent value="sliders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                🎭 Homepage Sliders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slider-title">Slider Title</Label>
                  <Input
                    id="slider-title"
                    value={newSlider.title}
                    onChange={(e) => setNewSlider(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Your Dream Trip Awaits"
                  />
                </div>
                <div>
                  <Label htmlFor="slider-subtitle">Subtitle</Label>
                  <Input
                    id="slider-subtitle"
                    value={newSlider.subtitle}
                    onChange={(e) => setNewSlider(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Discover amazing destinations"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slider-image">Image URL</Label>
                <Input
                  id="slider-image"
                  value={newSlider.image_url}
                  onChange={(e) => setNewSlider(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="button-text">Button Text</Label>
                  <Input
                    id="button-text"
                    value={newSlider.button_text}
                    onChange={(e) => setNewSlider(prev => ({ ...prev, button_text: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">Link URL</Label>
                  <Input
                    id="link-url"
                    value={newSlider.link_url}
                    onChange={(e) => setNewSlider(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="/tours"
                  />
                </div>
                <div>
                  <Label htmlFor="display-order">Display Order</Label>
                  <Input
                    id="display-order"
                    type="number"
                    value={newSlider.display_order}
                    onChange={(e) => setNewSlider(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button onClick={saveSlider} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Add Slider'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sliders.map((slider: any) => (
              <Card key={slider.id}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                    {slider.image_url && (
                      <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-semibold">{slider.title}</h3>
                  <p className="text-sm text-gray-600">{slider.subtitle}</p>
                  <div className="flex justify-between mt-3">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteSlider(slider.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Video Settings - Point 18 */}
        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                🎬 Video Section Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video-url">YouTube Video URL</Label>
                <Input
                  id="video-url"
                  value={videoSettings.video_url}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
              </div>
              <div>
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  value={videoSettings.title}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="video-description">Video Description</Label>
                <Textarea
                  id="video-description"
                  value={videoSettings.description}
                  onChange={(e) => setVideoSettings(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button onClick={saveVideoSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Video Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Settings - Point 16 */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                🔥 Trending Section Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trending-1-title">Trending Item 1 Title</Label>
                  <Input
                    id="trending-1-title"
                    value={trendingSettings.item1_title}
                    onChange={(e) => setTrendingSettings(prev => ({ ...prev, item1_title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="trending-1-bookings">Item 1 Booking Text</Label>
                  <Input
                    id="trending-1-bookings"
                    value={trendingSettings.item1_bookings}
                    onChange={(e) => setTrendingSettings(prev => ({ ...prev, item1_bookings: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trending-2-title">Trending Item 2 Title</Label>
                  <Input
                    id="trending-2-title"
                    value={trendingSettings.item2_title}
                    onChange={(e) => setTrendingSettings(prev => ({ ...prev, item2_title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="trending-2-bookings">Item 2 Booking Text</Label>
                  <Input
                    id="trending-2-bookings"
                    value={trendingSettings.item2_bookings}
                    onChange={(e) => setTrendingSettings(prev => ({ ...prev, item2_bookings: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="show-count">Number of Items to Show</Label>
                <Input
                  id="show-count"
                  type="number"
                  min="1"
                  max="4"
                  value={trendingSettings.show_count}
                  onChange={(e) => setTrendingSettings(prev => ({ ...prev, show_count: parseInt(e.target.value) || 2 }))}
                />
              </div>

              <Button onClick={saveTrendingSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Trending Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu & Footer Settings */}
        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                🧭 Menu & Footer Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Menu and footer items can be customized. Contact support for advanced menu customization.
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Footer Company Description</Label>
                  <Textarea
                    placeholder="Your trusted travel companion for unforgettable journeys..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input placeholder="+91-9125009662" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input placeholder="info@triphabibi.com" />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
