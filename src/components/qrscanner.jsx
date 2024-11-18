import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from 'lucide-react';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanQR = () => {
    // Placeholder for QR scanning logic
    setIsScanning(true);
    // Simulated scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Add actual QR code processing logic here
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-6 w-6" />
            <span>QR Code Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <Camera className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Scan the QR code to instantly connect to WhatsApp
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={handleScanQR} 
                className="w-full"
                disabled={isScanning}
              >
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center items-center h-64">
                {isScanning ? (
                  <div className="animate-pulse">
                    <QrCode className="h-32 w-32 text-gray-400" />
                    <p className="text-center mt-4 text-gray-600">Scanning in progress...</p>
                  </div>
                ) : (
                  <p>Position QR code within the frame</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;