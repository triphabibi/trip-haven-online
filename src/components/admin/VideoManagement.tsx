
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video, Save } from 'lucide-react';

interface VideoSettings {
  video_url: string;
  video_title: string;
  video_description: string;
  is_enabled: boolean;
}

const VideoManagement = () => {
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_title: 'Experience the Magic of Travel',
    video_description: 'Watch how we make your dream trips come true with our personalized travel experiences',
    is_enabled: true
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVideoSettings();
  }, []);

  const loadVideoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['video_url', 'video_title', 'video_description', 'video_enabled']);

      if (error) {
        console.error('Error loading video settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Record<string, string> = {};
        data.forEach(item => {
          settingsMap[item.setting_key] = item.setting_value || '';
        });

        setVideoSettings(prev => ({
          video_url: settingsMap.video_url || prev.video_url,
          video_title: settingsMap.video_title || prev.video_title,
          video_description: settingsMap.video_description || prev.video_description,
          is_enabled: settingsMap.video_enabled === 'true' || prev.is_enabled
        }));
      }
    } catch (error) {
      console.error('Error loading video settings:', error);
    }
  };

  const saveVideoSettings = async () => {
    setLoading(true);
    try {
      const settingsToSave = [
        { setting_key: 'video_url', setting_value: videoSettings.video_url },
        { setting_key: 'video_title', setting_value: videoSettings.video_title },
        { setting_key: 'video_description', setting_value: videoSettings.video_description },
        { setting_key: 'video_enabled', setting_value: videoSettings.is_enabled.toString() },
      ];

      // Delete existing video settings
      await supabase
        .from('site_settings')
        .delete()
        .in('setting_key', ['video_url', 'video_title', 'video_description', 'video_enabled']);

      // Insert new settings
      const { error } = await supabase
        .from('site_settings')
        .insert(settingsToSave);

      if (error) throw error;

      toast({
        title: "Video Settings Saved",
        description: "Homepage video settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving video settings:', error);
      toast({
        title: "Error",
        description: "Failed to save video settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Video className="h-6 w-6" />
            Video Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="video-enabled"
              checked={videoSettings.is_enabled}
              onCheckedChange={(checked) => 
                setVideoSettings(prev => ({ ...prev, is_enabled: checked }))
              }
            />
            <Label htmlFor="video-enabled" className="font-medium">
              Enable Homepage Video
            </Label>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-medium">Video URL</Label>
              <Input
                value={videoSettings.video_url}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-white border-gray-300"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use YouTube embed URL format (e.g., https://www.youtube.com/embed/VIDEO_ID)
              </p>
            </div>

            <div>
              <Label className="font-medium">Video Title</Label>
              <Input
                value={videoSettings.video_title}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, video_title: e.target.value }))}
                placeholder="Enter video title"
                className="bg-white border-gray-300"
              />
            </div>

            <div>
              <Label className="font-medium">Video Description</Label>
              <Textarea
                value={videoSettings.video_description}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, video_description: e.target.value }))}
                placeholder="Enter video description"
                className="bg-white border-gray-300"
                rows={3}
              />
            </div>
          </div>

          {/* Video Preview */}
          {videoSettings.is_enabled && videoSettings.video_url && (
            <div className="mt-6">
              <Label className="font-medium mb-2 block">Preview</Label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={videoSettings.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Preview"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={saveVideoSettings} 
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : 'Save Video Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManagement;
