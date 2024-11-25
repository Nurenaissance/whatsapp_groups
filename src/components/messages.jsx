import React, { useState, useEffect } from 'react'
import { format } from "date-fns"
import { parseISO, isValid } from "date-fns"
import uploadToBlob from "./azureUpload.jsx";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Image, 
  Video, 
  Mic, 
  File, 
  Trash2, 
  Eye, 
  Clock, 
  MessageCircle, 
  UserCheck 
} from "lucide-react"
import MediaPreview from './mediapreview'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { toast } from "@/hooks/use-toast"
import TimePicker from './timepicker'
const GROUPS_ENDPOINT = "https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/group_details/get_groups";
const safeFormatDate = (dateString) => {
  try {
    // First try parsing as ISO string
    const date = parseISO(dateString);
    
    // Check if the parsed date is valid
    if (isValid(date)) {
      return format(date, "PPP p");
    }
    
    // If not valid as ISO, try direct Date object creation
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return format(fallbackDate, "PPP p");
    }
    
    return "Invalid Date";
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};
const Messages = () => {
  // State Variables
  const [selectedGroups, setSelectedGroups] = useState([])
  const [messageType, setMessageType] = useState('text')
  const [scheduledTime, setScheduledTime] = useState(null)
  const [messageContent, setMessageContent] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaCaption, setMediaCaption] = useState('')
  const [scheduledMessages, setScheduledMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [GROUPS, setGroups] = useState([]);

  // Constant Definitions
  const MESSAGE_TYPES = [
    { value: 'text', icon: FileText, label: 'Text' },
    { value: 'image', icon: Image, label: 'Image' },
    { value: 'video', icon: Video, label: 'Video' },
    { value: 'document', icon: File, label: 'Document' },
    { value: 'voice', icon: Mic, label: 'Voice Note' }
  ]

  //const GROUPS = ['Marketing Team', 'Sales Team', 'Support Team', 'HR Team']

  // Get Message Type Icon
  const getMessageTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'text': return <MessageCircle className="text-blue-500 w-5 h-5" />;
      case 'image': return <Image className="text-green-500 w-5 h-5" />;
      case 'video': return <Video className="text-red-500 w-5 h-5" />;
      case 'document': return <File className="text-purple-500 w-5 h-5" />;
      case 'voice': return <Mic className="text-indigo-500 w-5 h-5" />;
      default: return <MessageCircle className="text-gray-500 w-5 h-5" />;
    }
  };

  // Handle Message Preview
  const handleMessagePreview = (message) => {
    setSelectedMessage(message);
    setPreviewOpen(true);
  };
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(GROUPS_ENDPOINT);
        const data = await response.json();

        // Extract group names from the correct structure
        // Each group has an id, name, description, and members
        const groupNames = data.groups.map(group => ({
          id: group.id,
          name: group.name
        }));
        
        setGroups(groupNames);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch groups",
          variant: "destructive"
        });
      }
    };

    fetchGroups();
  }, []);
  // Fetch Scheduled Messages
// Fetch Scheduled Messages
useEffect(() => {
  const fetchScheduledMessages = async () => {
    try {
      const response = await fetch('https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/schedule_message/get_schedule_messages')
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json()
      
      // Debugging: log the entire response
      console.log('Fetched messages:', data);

      // Ensure we're extracting the correct array of messages
      const messagesArray = Array.isArray(data) ? data : 
        (data.scheduled_messages && Array.isArray(data.scheduled_messages) ? data.scheduled_messages : 
        (data.messages && Array.isArray(data.messages) ? data.messages : []))
      
      // Sort messages by scheduled time (most recent first)
      const sortedMessages = messagesArray.sort((a, b) => 
        new Date(b.scheduleTime) - new Date(a.scheduleTime)
      );

      setScheduledMessages(sortedMessages)
    } catch (error) {
      console.error("Fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch scheduled messages",
        variant: "destructive"
      })
    }
  }

  fetchScheduledMessages()
  
  // Optional: Set up periodic refresh
  const intervalId = setInterval(fetchScheduledMessages, 60000); // Refresh every minute
  
  // Cleanup interval on component unmount
  return () => clearInterval(intervalId);
}, [])

  // Handle Message Submission
// Handle Message Submission
const handleSubmit = async () => {
  if (selectedGroups.length === 0) {
    toast({
      title: "Group Selection Required",
      description: "Please select at least one recipient group",
      variant: "destructive",
    });
    return;
  }
  // Validation
  if (!scheduledTime || (!messageContent && !media)) {
    toast({
      title: "Validation Error",
      description: "Please fill all fields and schedule the message!",
      variant: "destructive",
    });
    return;
  }

  try {
    // First upload media to Azure Blob if media exists
    let mediaURL = null;
    if (media) {
      try {
        const userId = "default-user"; // Replace with actual userId
        const tenantId = "default-tenant"; // Replace with actual tenantId

        // Upload to Azure Blob and get URL
        mediaURL = await uploadToBlob(media, userId, tenantId);
      } catch (error) {
        console.error("Error uploading to Azure:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload media file",
          variant: "destructive",
        });
        return;
      }
    }

    // Prepare Message Payload - matching API requirements
    const newMessage = {
      // For media types, use mediaCaption as content
      // For text types, use messageContent
      content: messageType !== 'text' 
        ? (mediaCaption || '') 
        : messageContent,
      scheduledTime: scheduledTime.toISOString(),
      groups: selectedGroups,
      messageType: messageType,
      status: false,
      media: media
        ? {
            url: mediaURL,
            type: media.type,
            name: media.name,
            file_extension: `.${media.name.split(".").pop()}`,
          }
        : null,
    };

    const response = await fetch(
      "https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/schedule_message/create_schedule_message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      }
    );

    if (response.ok) {
      const createdMessage = await response.json();

      // Update local state with the server-created message
      setScheduledMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          messageContent: newMessage.content,
          scheduleTime: newMessage.scheduledTime,
          id: createdMessage.id || Date.now(),
        },
      ]);

      resetForm();
      toast({
        title: "Success",
        description: "Message scheduled successfully",
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || "Failed to schedule message");
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: error.message || "Failed to schedule message",
      variant: "destructive",
    });
  }
};

  // Reset Form
  const resetForm = () => {
    setMessageContent('')
    setScheduledTime(null)
    setMedia(null)
    setMediaCaption('')
    setSelectedGroups([])
    setMessageType('text')
  }

  // Delete Scheduled Message
  const handleDeleteScheduledMessage = async (id) => {
    try {
      const response = await fetch(`https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/schedule_message/delete_scheduled_message/${id}`, {
        method: 'DELETE'
      })
  
      const result = await response.json()
  
      if (response.ok) {
        // Immediately refetch scheduled messages
        const fetchResponse = await fetch('https://fastapi2-dsfwetawhjb6gkbz.centralindia-01.azurewebsites.net/schedule_message/get_schedule_messages')
        const data = await fetchResponse.json()
        
        // Ensure we're extracting the correct array of messages
        const messagesArray = Array.isArray(data) ? data : 
          (data.scheduled_messages && Array.isArray(data.scheduled_messages) ? data.scheduled_messages : 
          (data.messages && Array.isArray(data.messages) ? data.messages : []))
        
        // Sort messages by scheduled time (most recent first)
        const sortedMessages = messagesArray.sort((a, b) => 
          new Date(b.scheduleTime) - new Date(a.scheduleTime)
        );
  
        setScheduledMessages(sortedMessages)
  
        // Enhanced toast with more detail
        toast({
          title: "Message Deleted",
          description: "Your scheduled message has been successfully removed.",
          duration: 3000, // Show for 3 seconds
          className: "bg-red-500 text-white", // Custom styling to make it stand out
          icon: <Trash2 className="w-5 h-5 text-white" />, // Add a delete icon
        })
      } else {
        throw new Error(result.detail || 'Failed to delete message')
      }
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Unable to delete the scheduled message",
        variant: "destructive",
        duration: 2000
      })
    }
  }
  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMedia(file)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
        <Clock className="w-8 h-8 text-primary" />
        Message Scheduler
      </h1>
      
      {/* Group Selection */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Select Groups</CardTitle>
          <CardDescription>Choose recipient groups for your message</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((group) => {
              // Calculate size based on the number of groups
              const badgeSize = GROUPS.length <= 3 ? 'px-6 py-3 text-xl' : 'px-3 py-2 text-sm';
              
              return (
                <Badge 
                  key={group.id}
                  variant={selectedGroups.includes(group.name) ? "default" : "outline"}
                  onClick={() => 
                    setSelectedGroups(prev => 
                      prev.includes(group.name) 
                        ? prev.filter(g => g !== group.name) 
                        : [...prev, group.name]
                    )
                  }
                  className={`cursor-pointer transition-all hover:scale-110 ${badgeSize}`}
                >
                  {group.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>


      {/* Message Type Selection */}
      <Card className="border-none shadow-sm">
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
                className="flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Content */}
      <Card className="border-none shadow-sm">
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
              className="min-h-[150px] focus:ring-2 focus:ring-primary/50 transition-all"
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
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
                className="focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card className="border-none shadow-sm">
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          className="w-full md:w-auto"
          disabled={!scheduledTime || (!messageContent && !media)}
        >
          Schedule Message
        </Button>
      </div>

      <MediaPreview 
        media={media} 
        caption={mediaCaption}
        messageType={messageType}
        messageContent={messageContent}
      />

      {/* Scheduled Messages */}
      <Card className="w-full shadow-lg border-none bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Scheduled Messages
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Preview and manage upcoming broadcasts
              </CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {scheduledMessages.length} Scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 w-full rounded-xl border-2 border-gray-100 p-4">
            {scheduledMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <Clock className="w-12 h-12 opacity-50" />
                <p className="text-lg font-medium">No scheduled messages</p>
                <p className="text-sm text-center">Create a new scheduled message to get started</p>
              </div>
            ) : (
              scheduledMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="mb-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleMessagePreview(msg)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {getMessageTypeIcon(msg.messageType)}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {msg.messageType.toUpperCase()} Message
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                          {safeFormatDate(msg.scheduleTime || msg.scheduledTime)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                          <UserCheck className="w-4 h-4" />
                          <span>Groups: {msg.groups.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessagePreview(msg);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScheduledMessage(msg.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="bg-white rounded-xl border p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {selectedMessage.messageType.toUpperCase()} Message
                </Badge>
                <div className="text-sm text-gray-500">
                Scheduled for: {safeFormatDate(selectedMessage.scheduleTime || selectedMessage.scheduledTime)}
                </div>
              </div>
              
              {/* Render Media Preview if exists */}
              {MediaPreview && (
                <div className="w-full flex justify-center mb-4">
                  {MediaPreview}
                </div>
              )}

              <div className="text-gray-700">
                {selectedMessage.messageContent}
              </div>

              <div className="mt-4">
                <div className="font-medium text-gray-600">Recipient Groups:</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMessage.groups.map((group) => (
                    <Badge key={group} variant="outline">{group}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
  )
}

export default Messages;
