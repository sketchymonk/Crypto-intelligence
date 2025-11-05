
import React from 'react';

const commonInputClass = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition";
const commonLabelClass = "block mb-1 text-sm font-medium text-gray-300";

interface InputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<InputProps> = ({ id, label, value, placeholder, onChange }) => (
  <div>
    <label htmlFor={id} className={commonLabelClass}>{label}</label>
    <input
      type="text"
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={commonInputClass}
    />
  </div>
);

export const TextArea: React.FC<InputProps> = ({ id, label, value, placeholder, onChange }) => (
  <div>
    <label htmlFor={id} className={commonLabelClass}>{label}</label>
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${commonInputClass} h-24`}
      rows={4}
    />
  </div>
);

interface SelectProps extends InputProps {
  options: { value: string; label: string }[];
}

export const SelectInput: React.FC<SelectProps> = ({ id, label, value, options, onChange }) => (
  <div>
    <label htmlFor={id} className={commonLabelClass}>{label}</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={commonInputClass}
    >
      <option value="" disabled>Select an option</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

interface CheckboxGroupProps {
  id: string;
  label: string;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (value: string[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ id, label, value, options, onChange }) => {
  const handleChange = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div>
      <label className={commonLabelClass}>{label}</label>
      <div className="space-y-2 mt-2">
        {options.map(option => (
          <label key={option.value} htmlFor={`${id}-${option.value}`} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id={`${id}-${option.value}`}
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-300">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
