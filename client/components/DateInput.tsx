import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Keyboard, 
  List,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format, parse, isValid, isBefore, isAfter } from "date-fns";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  constraints?: {
    minAge?: number;
    maxAge?: number;
    futureAllowed?: boolean;
    pastRequired?: boolean;
  };
  className?: string;
}

type InputMode = 'calendar' | 'dropdown' | 'text';

export default function DateInput({
  label,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  minDate,
  maxDate,
  constraints,
  className
}: DateInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>('calendar');
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState(value);
  const [dropdownMonth, setDropdownMonth] = useState('');
  const [dropdownDay, setDropdownDay] = useState('');
  const [dropdownYear, setDropdownYear] = useState('');
  const [validationError, setValidationError] = useState('');

  // Parse current value
  const currentDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : null;
  const isCurrentDateValid = currentDate && isValid(currentDate);

  // Initialize dropdown values from current date
  useState(() => {
    if (isCurrentDateValid) {
      setDropdownMonth((currentDate.getMonth() + 1).toString().padStart(2, '0'));
      setDropdownDay(currentDate.getDate().toString().padStart(2, '0'));
      setDropdownYear(currentDate.getFullYear().toString());
    }
  });

  // Validation function
  const validateDate = (date: Date, dateString: string): string => {
    if (!isValid(date)) {
      return "Please enter a valid date";
    }

    if (minDate && isBefore(date, minDate)) {
      return `Date must be after ${format(minDate, 'MMM dd, yyyy')}`;
    }

    if (maxDate && isAfter(date, maxDate)) {
      return `Date must be before ${format(maxDate, 'MMM dd, yyyy')}`;
    }

    if (constraints) {
      const today = new Date();
      const age = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

      if (constraints.minAge && age < constraints.minAge) {
        return `You must be at least ${constraints.minAge} years old`;
      }

      if (constraints.maxAge && age > constraints.maxAge) {
        return `Age cannot exceed ${constraints.maxAge} years`;
      }

      if (constraints.futureAllowed === false && isAfter(date, today)) {
        return "Future dates are not allowed";
      }

      if (constraints.pastRequired === true && !isBefore(date, today)) {
        return "Date must be in the past";
      }
    }

    return '';
  };

  // Handle calendar selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      const error = validateDate(date, dateString);
      
      if (error) {
        setValidationError(error);
      } else {
        setValidationError('');
        onChange(dateString);
        setIsOpen(false);
      }
    }
  };

  // Handle text input
  const handleTextInputChange = (inputValue: string) => {
    setTextInput(inputValue);
    
    // Try to parse various date formats
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'MM-dd-yyyy',
      'MMM dd, yyyy',
      'MMMM dd, yyyy'
    ];

    let parsedDate: Date | null = null;
    let validFormat = '';

    for (const formatStr of formats) {
      try {
        const testDate = parse(inputValue, formatStr, new Date());
        if (isValid(testDate)) {
          parsedDate = testDate;
          validFormat = formatStr;
          break;
        }
      } catch (e) {
        // Continue to next format
      }
    }

    if (parsedDate) {
      const dateString = format(parsedDate, 'yyyy-MM-dd');
      const error = validateDate(parsedDate, dateString);
      
      if (error) {
        setValidationError(error);
      } else {
        setValidationError('');
        onChange(dateString);
      }
    } else if (inputValue.trim()) {
      setValidationError('Please enter a valid date (MM/DD/YYYY, DD/MM/YYYY, or MMM DD, YYYY)');
    } else {
      setValidationError('');
      onChange('');
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (type: 'month' | 'day' | 'year', value: string) => {
    let newMonth = dropdownMonth;
    let newDay = dropdownDay;
    let newYear = dropdownYear;

    switch (type) {
      case 'month':
        newMonth = value;
        setDropdownMonth(value);
        break;
      case 'day':
        newDay = value;
        setDropdownDay(value);
        break;
      case 'year':
        newYear = value;
        setDropdownYear(value);
        break;
    }

    if (newMonth && newDay && newYear) {
      try {
        const dateString = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        
        if (isValid(date)) {
          const error = validateDate(date, dateString);
          
          if (error) {
            setValidationError(error);
          } else {
            setValidationError('');
            onChange(dateString);
          }
        } else {
          setValidationError('Invalid date combination');
        }
      } catch (e) {
        setValidationError('Invalid date');
      }
    }
  };

  // Generate options for dropdowns
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString()
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        {/* Input mode selector */}
        <div className="flex border rounded-md">
          <Button
            type="button"
            variant={inputMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-2"
            onClick={() => setInputMode('calendar')}
          >
            <CalendarIcon className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant={inputMode === 'dropdown' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-2"
            onClick={() => setInputMode('dropdown')}
          >
            <List className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant={inputMode === 'text' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-2"
            onClick={() => setInputMode('text')}
          >
            <Keyboard className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Calendar Mode */}
      {inputMode === 'calendar' && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                validationError && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isCurrentDateValid ? format(currentDate, 'PPP') : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={isCurrentDateValid ? currentDate : undefined}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                if (minDate && isBefore(date, minDate)) return true;
                if (maxDate && isAfter(date, maxDate)) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Dropdown Mode */}
      {inputMode === 'dropdown' && (
        <div className="grid grid-cols-3 gap-2">
          <Select value={dropdownMonth} onValueChange={(value) => handleDropdownChange('month', value)}>
            <SelectTrigger className={cn(validationError && "border-red-500")}>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dropdownDay} onValueChange={(value) => handleDropdownChange('day', value)}>
            <SelectTrigger className={cn(validationError && "border-red-500")}>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dropdownYear} onValueChange={(value) => handleDropdownChange('year', value)}>
            <SelectTrigger className={cn(validationError && "border-red-500")}>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Text Mode */}
      {inputMode === 'text' && (
        <div>
          <Input
            type="text"
            placeholder="MM/DD/YYYY or Month DD, YYYY"
            value={textInput}
            onChange={(e) => handleTextInputChange(e.target.value)}
            className={cn(validationError && "border-red-500")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: MM/DD/YYYY, DD/MM/YYYY, MMM DD, YYYY
          </p>
        </div>
      )}

      {/* Current value display and validation */}
      <div className="flex items-center justify-between text-sm">
        {value && isCurrentDateValid && !validationError && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>{format(currentDate, 'MMM dd, yyyy')}</span>
          </div>
        )}
        
        {validationError && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>{validationError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
