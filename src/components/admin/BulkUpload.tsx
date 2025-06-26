
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BulkUpload = () => {
  const [uploadType, setUploadType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = (type: string) => {
    const templates = {
      tours: 'title,description,price_adult,price_child,price_infant,duration,category,highlights,whats_included,languages\n',
      packages: 'title,description,price_adult,price_child,price_infant,days,nights,highlights,whats_included\n',
      tickets: 'title,description,price_adult,price_child,price_infant,location,instant_delivery\n',
      visas: 'country,visa_type,price,processing_time,description,requirements\n'
    };

    const csv = templates[type as keyof typeof templates];
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file || !uploadType) {
      toast({
        title: "Error",
        description: "Please select upload type and file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create upload record
      const { data: uploadRecord, error: uploadError } = await supabase
        .from('bulk_uploads')
        .insert({
          upload_type: uploadType,
          file_name: file.name,
          status: 'processing'
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      // Parse CSV file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1);

      let processed = 0;
      let failed = 0;

      // Process each row
      for (const row of rows) {
        if (!row.trim()) continue;
        
        const values = row.split(',').map(v => v.trim());
        const rowData = headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {} as any);

        try {
          // Insert based on upload type
          switch (uploadType) {
            case 'tours':
              await supabase.from('tours').insert({
                title: rowData.title,
                description: rowData.description,
                price_adult: parseFloat(rowData.price_adult) || 0,
                price_child: parseFloat(rowData.price_child) || 0,
                price_infant: parseFloat(rowData.price_infant) || 0,
                duration: rowData.duration,
                category: rowData.category || 'tour',
                highlights: rowData.highlights ? rowData.highlights.split(';') : [],
                whats_included: rowData.whats_included ? rowData.whats_included.split(';') : [],
                languages: rowData.languages ? rowData.languages.split(';') : ['English'],
                status: 'active'
              });
              break;
            case 'packages':
              await supabase.from('tour_packages').insert({
                title: rowData.title,
                description: rowData.description,
                price_adult: parseFloat(rowData.price_adult) || 0,
                price_child: parseFloat(rowData.price_child) || 0,
                price_infant: parseFloat(rowData.price_infant) || 0,
                days: parseInt(rowData.days) || 1,
                nights: parseInt(rowData.nights) || 0,
                highlights: rowData.highlights ? rowData.highlights.split(';') : [],
                whats_included: rowData.whats_included ? rowData.whats_included.split(';') : [],
                status: 'active'
              });
              break;
            case 'tickets':
              await supabase.from('attraction_tickets').insert({
                title: rowData.title,
                description: rowData.description,
                price_adult: parseFloat(rowData.price_adult) || 0,
                price_child: parseFloat(rowData.price_child) || 0,
                price_infant: parseFloat(rowData.price_infant) || 0,
                location: rowData.location,
                instant_delivery: rowData.instant_delivery === 'true',
                status: 'active'
              });
              break;
            case 'visas':
              await supabase.from('visa_services').insert({
                country: rowData.country,
                visa_type: rowData.visa_type,
                price: parseFloat(rowData.price) || 0,
                processing_time: rowData.processing_time,
                description: rowData.description,
                requirements: rowData.requirements ? rowData.requirements.split(';') : [],
                status: 'active'
              });
              break;
          }
          processed++;
        } catch (error) {
          console.error('Row processing error:', error);
          failed++;
        }
      }

      // Update upload record
      await supabase.from('bulk_uploads').update({
        status: 'completed',
        total_records: rows.length,
        processed_records: processed,
        failed_records: failed
      }).eq('id', uploadRecord.id);

      toast({
        title: "Upload Complete!",
        description: `Processed: ${processed}, Failed: ${failed}`,
      });

      setFile(null);
      setUploadType('');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="uploadType">Upload Type</Label>
          <Select value={uploadType} onValueChange={setUploadType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type to upload" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tours">Tours</SelectItem>
              <SelectItem value="packages">Packages</SelectItem>
              <SelectItem value="tickets">Attraction Tickets</SelectItem>
              <SelectItem value="visas">Visas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {uploadType && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => downloadTemplate(uploadType)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <span className="text-sm text-gray-500">Download CSV template first</span>
          </div>
        )}

        <div>
          <Label htmlFor="file">Upload CSV File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || !uploadType || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Upload & Process'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkUpload;
