import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, Eye, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  try {
    // Handle both string and Date object inputs
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    // Validate the parsed date
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    return format(date, 'PPP p');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date Format';
  }
};

const MessageCard = ({ msg, onPreview, onDelete }) => {
  const handleClick = (e) => {
    onPreview(msg);
  };

  return (
    <div 
      className="mb-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {msg.messageType && (
            <div className="text-blue-500">
              {/* You can customize this based on message type */}
              <Clock className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-800">
              {msg.messageType ? msg.messageType.toUpperCase() : 'Message'} 
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(msg.scheduleTime || msg.scheduledTime)}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Groups: {Array.isArray(msg.groups) ? msg.groups.join(', ') : 'No groups'}</span>
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
              onPreview(msg);
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
              onDelete(msg.id);
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ScheduledMessages = ({ 
  scheduledMessages = [], 
  handleMessagePreview, 
  handleDeleteScheduledMessage 
}) => {
  return (
    <ScrollArea className="h-80 w-full rounded-xl border-2 border-gray-100 p-4">
      {scheduledMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
          <Clock className="w-12 h-12 opacity-50" />
          <p className="text-lg font-medium">No scheduled messages</p>
          <p className="text-sm text-center">Create a new scheduled message to get started</p>
        </div>
      ) : (
        scheduledMessages.map((msg) => (
          <MessageCard
            key={msg.id}
            msg={msg}
            onPreview={handleMessagePreview}
            onDelete={handleDeleteScheduledMessage}
          />
        ))
      )}
    </ScrollArea>
  );
};

export default ScheduledMessages;