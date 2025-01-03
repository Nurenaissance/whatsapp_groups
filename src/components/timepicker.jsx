import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const TimePicker = ({ scheduledTime, setScheduledTime }) => {
  const [tempTime, setTempTime] = useState({
    hours: scheduledTime ? scheduledTime.getHours() : 12,
    minutes: scheduledTime ? scheduledTime.getMinutes() : 0,
    period: scheduledTime ? (scheduledTime.getHours() >= 12 ? 'PM' : 'AM') : 'AM',
  });

  const handleTimeChange = (field, value) => {
    const newTempTime = { ...tempTime, [field]: value };

    // Convert to 24-hour format
    let hours = parseInt(newTempTime.hours);
    if (newTempTime.period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (newTempTime.period === 'AM' && hours === 12) {
      hours = 0;
    }

    const newDateTime = scheduledTime ? new Date(scheduledTime) : new Date();
    newDateTime.setHours(hours, parseInt(newTempTime.minutes), 0, 0);

    // Only update if time is valid
    if (validateScheduledTime(newDateTime, newTempTime)) {
      setTempTime(newTempTime);
      setScheduledTime(newDateTime);
    } else {
      toast.error('Selected time must be greater than the current time');
    }
  };

  const generateTimeOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const validateScheduledTime = (selectedDate, tempTime) => {
    // Get current date and time
    const currentDate = new Date();

    // Set selected time (hours, minutes, period)
    if (tempTime) {
      const selectedHours =
        tempTime.period === 'PM' && tempTime.hours !== '12'
          ? parseInt(tempTime.hours) + 12
          : parseInt(tempTime.hours);
      const selectedMinutes = parseInt(tempTime.minutes);

      selectedDate.setHours(selectedHours);
      selectedDate.setMinutes(selectedMinutes);
    }

    // Compare selected date with the current date
    return selectedDate >= currentDate; // Valid if greater than or equal to current time
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Message</CardTitle>
        <CardDescription>Choose when to send your message</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !scheduledTime && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledTime ? (
                format(scheduledTime, 'PPP HH:mm')
              ) : (
                <span>Pick a date and time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 flex">
  <div className="p-2">
    <Calendar
      mode="single"
      selected={scheduledTime}
      onSelect={(date) => {
        // Ensure the selected date/time is greater than the current date/time
        if (validateScheduledTime(date, tempTime)) {
          setScheduledTime(date);
        } else {
          // Show the toast error instead of alert
          toast.error('Selected date/time must be greater than the current date/time.');
        }
      }}
      initialFocus
    />
  </div>
  <div className="border-l p-4 space-y-4 w-[200px]">
    <div className="space-y-2">
      <Label>Hours</Label>
      <Select
        value={tempTime.hours.toString()}
        onValueChange={(value) => handleTimeChange('hours', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          {generateTimeOptions(1, 12).map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Minutes</Label>
      <Select
        value={tempTime.minutes.toString()}
        onValueChange={(value) => handleTimeChange('minutes', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          {generateTimeOptions(0, 59).map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Period</Label>
      <Select
        value={tempTime.period}
        onValueChange={(value) => handleTimeChange('period', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</PopoverContent>

        </Popover>
      </CardContent>
    </Card>
  );
};

export default TimePicker;
