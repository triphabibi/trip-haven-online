
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface SMTPSettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: string) => void;
}

const SMTPSettings = ({ settings, onSettingChange }: SMTPSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          SMTP Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="smtp_host">SMTP Host</Label>
            <Input
              id="smtp_host"
              placeholder="smtp.gmail.com"
              value={settings.smtp_host || ''}
              onChange={(e) => onSettingChange('smtp_host', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtp_port">SMTP Port</Label>
            <Input
              id="smtp_port"
              type="number"
              placeholder="587"
              value={settings.smtp_port || '587'}
              onChange={(e) => onSettingChange('smtp_port', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="smtp_username">SMTP Username</Label>
          <Input
            id="smtp_username"
            type="email"
            placeholder="your-email@gmail.com"
            value={settings.smtp_username || ''}
            onChange={(e) => onSettingChange('smtp_username', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="smtp_password">SMTP Password</Label>
          <Input
            id="smtp_password"
            type="password"
            placeholder="Your app password"
            value={settings.smtp_password || ''}
            onChange={(e) => onSettingChange('smtp_password', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="smtp_from_email">From Email</Label>
            <Input
              id="smtp_from_email"
              type="email"
              placeholder="noreply@triphabibi.in"
              value={settings.smtp_from_email || ''}
              onChange={(e) => onSettingChange('smtp_from_email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtp_from_name">From Name</Label>
            <Input
              id="smtp_from_name"
              placeholder="TripHabibi"
              value={settings.smtp_from_name || 'TripHabibi'}
              onChange={(e) => onSettingChange('smtp_from_name', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMTPSettings;
