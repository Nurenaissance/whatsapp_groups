import React, { useState } from 'react';
import { Camera, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from 'qrcode.react';

const QRScanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQRData] = useState(null);

  const handleGetQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://20.84.153.108:8000/qr_code/get_qr');
      const data = await response.json();

      if (data && data.qr_text &&data.qr_text!=null) {
        setQRData(data.qr_text);
      } else {
        console.error('Invalid QR code data');
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-6 w-6" />
            <span>QR Code Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
            {qrData ? (
              <div className="flex justify-center">
                <QRCodeSVG value={qrData} size={256} />
              </div>
            ) : (
              <>
                <Camera className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Click "Get QR Now" to generate a scannable QR code
                </p>
              </>
            )}
          </div>

          <Button 
            onClick={handleGetQRCode} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Get QR Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;