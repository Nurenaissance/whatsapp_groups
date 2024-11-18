import React, { useState } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon, FileText, Image, Video, Mic, File, Trash2 } from "lucide-react"
import MediaPreview from './mediapreview'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import TimePicker from './timepicker'
const Messages = () => {
  const [selectedGroups, setSelectedGroups] = useState([])
  const [messageType, setMessageType] = useState('text')
  const [scheduledTime, setScheduledTime] = useState(null)
  const [messageContent, setMessageContent] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaCaption, setMediaCaption] = useState('')
  const [scheduledMessages, setScheduledMessages] = useState([])

  const MESSAGE_TYPES = [
    { value: 'text', icon: FileText, label: 'Text' },
    { value: 'image', icon: Image, label: 'Image' },
    { value: 'video', icon: Video, label: 'Video' },
    { value: 'document', icon: File, label: 'Document' },
    { value: 'voice', icon: Mic, label: 'Voice Note' }
  ]

  const GROUPS = ['Marketing Team', 'Sales Team', 'Support Team', 'HR Team']

  const handleSubmit = () => {
    if (!scheduledTime || (!messageContent && !media)) {
      alert("Please fill all fields and schedule the message!")
      return
    }

    const newMessage = {
      id: Date.now(),
      groups: selectedGroups,
      messageType,
      content: messageContent,
      media,
      caption: mediaCaption,
      scheduledTime,
    }

    setScheduledMessages([...scheduledMessages, newMessage])
    resetForm()
  }

  const resetForm = () => {
    setMessageContent('')
    setScheduledTime(null)
    setMedia(null)
    setMediaCaption('')
    setSelectedGroups([])
  }

  const handleDeleteScheduledMessage = (id) => {
    setScheduledMessages(scheduledMessages.filter(msg => msg.id !== id))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setMedia(file)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Message Scheduler</h1>
      
      {/* Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Groups</CardTitle>
          <CardDescription>Choose recipient groups for your message</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((group) => (
              <Badge 
                key={group}
                variant={selectedGroups.includes(group) ? "default" : "outline"}
                onClick={() => 
                  setSelectedGroups(prev => 
                    prev.includes(group) 
                      ? prev.filter(g => g !== group) 
                      : [...prev, group]
                  )
                }
                className="cursor-pointer"
              >
                {group}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Message Type</CardTitle>
          <CardDescription>Select the type of message you want to send</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {MESSAGE_TYPES.map(({ value, icon: Icon, label }) => (
              <Button 
                key={value}
                variant={messageType === value ? "default" : "outline"}
                onClick={() => setMessageType(value)}
                className="flex items-center justify-center space-x-2"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Content */}
      <Card>
        <CardHeader>
          <CardTitle>Message Content</CardTitle>
          <CardDescription>Enter your message details</CardDescription>
        </CardHeader>
        <CardContent>
          {messageType === 'text' ? (
            <Textarea
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="min-h-[150px]"
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">{`${messageType.charAt(0).toUpperCase() + messageType.slice(1)} files only`}</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={`${messageType}/*`}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {media && (
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <span className="text-sm truncate">{media.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMedia(null)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <Input 
                placeholder="Add a caption (optional)" 
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Message</CardTitle>
          <CardDescription>Choose when to send your message</CardDescription>
        </CardHeader>
        <CardContent>
          <TimePicker 
            scheduledTime={scheduledTime} 
            setScheduledTime={setScheduledTime} 
          />
        </CardContent>
      </Card>
      <MediaPreview 
  media={media} 
  caption={mediaCaption}
  messageType={messageType}
  messageContent={messageContent}
/>
      {/* Scheduled Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Messages</CardTitle>
          <CardDescription>List of upcoming scheduled messages</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            {scheduledMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No scheduled messages
              </div>
            ) : (
              scheduledMessages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{msg.messageType.toUpperCase()} Message</div>
                      <div className="text-sm text-gray-500">
                        {format(msg.scheduledTime, "PPP HH:mm")}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Groups: {msg.groups.join(', ')}
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteScheduledMessage(msg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default Messages;