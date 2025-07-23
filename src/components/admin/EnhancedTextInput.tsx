import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AITextRewriter from './AITextRewriter';

interface EnhancedTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'input' | 'textarea';
  aiType?: string;
  required?: boolean;
  className?: string;
  rows?: number;
}

const EnhancedTextInput: React.FC<EnhancedTextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'input',
  aiType = 'default',
  required = false,
  className = '',
  rows = 4
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value && value.trim() && (
          <AITextRewriter
            text={value}
            type={aiType}
            onRewrite={onChange}
          />
        )}
      </div>
      
      {type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      )}
    </div>
  );
};

export default EnhancedTextInput;