import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedTextInput from './EnhancedTextInput';

interface FormField {
  key: string;
  label: string;
  type?: 'input' | 'textarea';
  aiType?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

interface AIEnhancedFormProps {
  title: string;
  fields: FormField[];
  data: Record<string, any>;
  onChange: (key: string, value: any) => void;
  children?: React.ReactNode;
}

const AIEnhancedForm: React.FC<AIEnhancedFormProps> = ({
  title,
  fields,
  data,
  onChange,
  children
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <EnhancedTextInput
            key={field.key}
            label={field.label}
            value={data[field.key] || ''}
            onChange={(value) => onChange(field.key, value)}
            type={field.type}
            aiType={field.aiType}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        ))}
        {children}
      </CardContent>
    </Card>
  );
};

export default AIEnhancedForm;