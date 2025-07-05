
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

interface ItineraryEditorProps {
  itinerary: { days: ItineraryDay[] };
  onItineraryChange: (itinerary: { days: ItineraryDay[] }) => void;
}

const ItineraryEditor = ({ itinerary, onItineraryChange }: ItineraryEditorProps) => {
  const addDay = () => {
    const newDay: ItineraryDay = {
      day: (itinerary.days?.length || 0) + 1,
      title: `Day ${(itinerary.days?.length || 0) + 1}`,
      description: '',
      activities: []
    };
    
    const updatedItinerary = {
      days: [...(itinerary.days || []), newDay]
    };
    onItineraryChange(updatedItinerary);
  };

  const removeDay = (index: number) => {
    const updatedDays = itinerary.days?.filter((_, i) => i !== index) || [];
    // Renumber days
    const renumberedDays = updatedDays.map((day, i) => ({
      ...day,
      day: i + 1,
      title: day.title.includes('Day') ? `Day ${i + 1}` : day.title
    }));
    
    onItineraryChange({ days: renumberedDays });
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | string[]) => {
    const updatedDays = [...(itinerary.days || [])];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    onItineraryChange({ days: updatedDays });
  };

  const updateActivities = (index: number, activitiesText: string) => {
    const activities = activitiesText.split('\n').filter(activity => activity.trim());
    updateDay(index, 'activities', activities);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Detailed Itinerary</h3>
        <Button type="button" onClick={addDay} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>

      {!itinerary.days || itinerary.days.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">No itinerary days added yet</p>
            <Button onClick={addDay} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add First Day
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {itinerary.days.map((day, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    Day {day.day}
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => removeDay(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`day-title-${index}`}>Day Title</Label>
                  <Input
                    id={`day-title-${index}`}
                    value={day.title}
                    onChange={(e) => updateDay(index, 'title', e.target.value)}
                    placeholder={`Day ${day.day} - Enter title`}
                    className="bg-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`day-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`day-desc-${index}`}
                    value={day.description}
                    onChange={(e) => updateDay(index, 'description', e.target.value)}
                    placeholder="Brief description of the day"
                    className="bg-white"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`day-activities-${index}`}>Activities (one per line)</Label>
                  <Textarea
                    id={`day-activities-${index}`}
                    value={day.activities?.join('\n') || ''}
                    onChange={(e) => updateActivities(index, e.target.value)}
                    placeholder="Activity 1&#10;Activity 2&#10;Activity 3"
                    className="bg-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryEditor;
