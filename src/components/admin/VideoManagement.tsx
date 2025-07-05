
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video, Save, Eye } from 'lucide-react';

const VideoManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState({
    url: '',
    title: 'Experience Dubai Like Never Before',
    description: 'Watch our exclusive travel experiences and discover why thousands choose TripHabibi'
  });

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  const fetchVideoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['homepage_video_url', 'homepage_video_title', 'homepage_video_description']);
      
      if (error) throw error;

      if (data) {
        data.forEach(setting => {
          if (setting.setting_key === 'homepage_video_url') {
            setVideoData(prev => ({ ...prev, url: setting.setting_value || '' }));
          } else if (setting.setting_key === 'homepage_video_title') {
            setVideoData(prev => ({ ...prev, title: setting.setting_value || 'Experience Dubai Like Never Before' }));
          } else if (setting.setting_key === 'homepage_video_description') {
            setVideoData(prev => ({ ...prev, description: setting.setting_value || 'Watch our exclusive travel experiences and discover why thousands choose TripHabibi' }));
          }
        });
      }
    } catch (error) {
      console.error('Error fetching video settings:', error);
    }
  };

  const saveVideoSettings = async () => {
    setLoading(true);
    try {
      const settings = [
        { key: 'homepage_video_url', value: videoData.url },
        { key: 'homepage_video_title', value: videoData.title },
        { key: 'homepage_video_description', value: videoData.description }
      ];

      for (const setting of settings) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            setting_key: setting.key,
            setting_value: setting.value,
            setting_type: 'text'
          }, {
            onConflict: 'setting_key'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Video settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving video settings:', error);
      toast({
        title: "Error",
        description: "Failed to save video settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Homepage Video Management
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url">YouTube Video URL *</Label>
            <Input
              id="video-url"
              value={videoData.url}
              onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="bg-white border-gray-300"
            />
            <p className="text-sm text-gray-600">
              Enter the full YouTube URL. Both youtube.com/watch and youtu.be formats are supported.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-title">Video Section Title</Label>
            <Input
              id="video-title"
              value={videoData.title}
              onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Experience Dubai Like Never Before"
              className="bg-white border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Video Section Description</Label>
            <Textarea
              id="video-description"
              value={videoData.description}
              onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Watch our exclusive travel experiences and discover why thousands choose TripHabibi"
              className="bg-white border-gray-300"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={saveVideoSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            
            {videoData.url && (
              <Button 
                variant="outline"
                onClick={() => window.open(videoData.url, '_blank')}
                className="bg-white border-gray-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Video
              </Button>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Copy the YouTube video URL from your browser</li>
              <li>• Paste it in the Video URL field above</li>
              <li>• Customize the title and description</li>
              <li>• Click Save Changes to update the homepage video</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManagement;
