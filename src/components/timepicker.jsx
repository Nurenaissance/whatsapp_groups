import React, { useState } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

const TimePicker = ({ scheduledTime, setScheduledTime }) => {
  const [tempTime, setTempTime] = useState({
    hours: scheduledTime ? scheduledTime.getHours() : 12,
    minutes: scheduledTime ? scheduledTime.getMinutes() : 0,
    period: scheduledTime ? (scheduledTime.getHours() >= 12 ? 'PM' : 'AM') : 'AM'
  })

  const handleTimeChange = (field, value) => {
    const newTempTime = { ...tempTime, [field]: value }
    
    // Convert to 24-hour format
    let hours = parseInt(newTempTime.hours)
    if (newTempTime.period === 'PM' && hours !== 12) {
      hours += 12
    }
    if (newTempTime.period === 'AM' && hours === 12) {
      hours = 0
    }

    const newDateTime = scheduledTime ? new Date(scheduledTime) : new Date()
    newDateTime.setHours(hours, parseInt(newTempTime.minutes), 0, 0)
    
    setTempTime(newTempTime)
    setScheduledTime(newDateTime)
  }

  const generateTimeOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

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
                "w-full justify-start text-left font-normal",
                !scheduledTime && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledTime ? (
                format(scheduledTime, "PPP HH:mm")
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
                onSelect={setScheduledTime}
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
                  <SelectContent>
                    {generateTimeOptions(1, 12).map(hour => (
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
                  <SelectContent>
                    {generateTimeOptions(0, 59).map(minute => (
                      <SelectItem 
                        key={minute} 
                        value={minute.toString()}
                      >
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
                  <SelectContent>
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
  )
}

export default TimePicker

// Don't forget to import Label
