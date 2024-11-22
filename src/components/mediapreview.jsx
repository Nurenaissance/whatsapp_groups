import React from 'react'
import { 
  Card, 
  CardContent 
} from "@/components/ui/card"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MediaPreview = ({ media, caption, messageType, messageContent }) => {
  const renderMedia = () => {
    if (messageType === 'image' && media) {
      return (
        <div className={cn(
          "w-full max-w-[350px] rounded-2xl overflow-hidden shadow-md mb-2",
          "border border-gray-100"
        )}>
          <img
            src={URL.createObjectURL(media)}
            alt="Image Preview"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </div>
      )
    } else if (messageType === 'video' && media) {
      return (
        <div className={cn(
          "w-full max-w-[350px] rounded-2xl overflow-hidden shadow-md mb-2",
          "border border-gray-100"
        )}>
          <video
            width="100%"
            controls
            className="rounded-2xl"
          >
            <source src={URL.createObjectURL(media)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    } else if (messageType === 'text' && messageContent) {
      return (
        <div className={cn(
          "p-2 bg-white rounded-xl shadow-sm max-w-[350px] mb-2",
          "border border-gray-100"
        )}>
          <p className="text-sm text-gray-700">
            {messageContent}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Preview Message
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Message Preview</AlertDialogTitle>
          <AlertDialogDescription>
            This is how your message will look
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Card className={cn(
          "max-w-[400px] shadow-sm rounded-2xl mb-4",
          "bg-gray-50 border border-gray-100"
        )}>
          <CardContent className="p-3">
            <div className="mb-2">
              {renderMedia()}
            </div>
            
            {((messageType === 'image' || messageType === 'video') && caption) && (
              <p className={cn(
                "mt-2 text-sm text-gray-600",
                "line-clamp-2" // Truncate long captions
              )}>
                {caption}
              </p>
            )}
          </CardContent>
        </Card>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MediaPreview