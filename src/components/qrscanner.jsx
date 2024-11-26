import React, { useState } from 'react';
import { Camera, QrCode, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "sonner";

const QRScanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const handleGetQRCode = async () => {
    setIsLoading(true);
    try {
      // Use relative URL with a leading slash
      const response = await fetch('/qr_code/get_qr', {
        method: 'GET',
        headers: {
          // Optional: set headers if needed
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();

      if (data && data.qr_text && data.qr_text != null) {
        setQRData(data.qr_text);
        setIsLoggedIn(false);
        setIsTracking(false);
      } else {
        console.error('Invalid QR code data');
        toast.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      toast.error('Error generating QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTracking = async () => {
    setIsLoading(true);
    try {
      // Use relative URL with a leading slash
      const response = await fetch('/tracking/start', {
        method: 'POST',
        headers: {
          // Optional: set headers if needed
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsTracking(true);
        toast.success('Tracking started successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to start tracking');
      }
    } catch (error) {
      console.error('Error starting tracking:', error);
      toast.error('Error starting tracking');
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
            <span>WhatsApp Login & Tracking</span>
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
                  Click "Get QR Code" to generate WhatsApp login QR
                </p>
              </>
            )}
          </div>

          <Button 
            onClick={handleGetQRCode} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Get QR Code'}
          </Button>

          {qrData && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-3">
                Scan the QR code with your WhatsApp mobile app to log in
              </p>
              <Button 
                onClick={handleStartTracking}
                className="w-full"
                disabled={isLoading || isTracking}
                variant={isTracking ? "default" : "outline"}
              >
                {isTracking ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Tracking Started
                  </>
                ) : (
                  "Click Here After WhatsApp Login"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;