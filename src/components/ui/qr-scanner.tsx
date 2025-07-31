
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode } from 'lucide-react';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  expectedValue: string;
}

export function QrScanner({ onScanSuccess, expectedValue }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        scannerRef.current = new Html5Qrcode('qr-reader');
        startScanner();

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    const startScanner = () => {
      if (scannerRef.current && scannerRef.current.isScanning === false) {
        scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (decodedText === expectedValue) {
              stopScanner();
              onScanSuccess(decodedText);
            } else {
              toast({
                variant: 'destructive',
                title: 'Incorrect QR Code',
                description: `Scanned an invalid QR code. Please scan the correct one for task ${expectedValue}.`,
              });
            }
          },
          (errorMessage) => {
            // console.warn(`QR Code no longer in front of camera.`, errorMessage);
          }
        ).catch((err) => {
            console.error("Scanner start error", err);
            toast({
                variant: 'destructive',
                title: 'Scanner Error',
                description: 'Could not start the QR code scanner.',
            });
        });
      }
    };

    const stopScanner = () => {
      if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };

    getCameraPermission();

    return () => {
      stopScanner();
      if(videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanSuccess, expectedValue, toast]);


  return (
    <div className="space-y-4">
      <div id="qr-reader" className="w-full aspect-video rounded-md bg-muted flex items-center justify-center">
         {hasCameraPermission === null && <p>Requesting camera permission...</p>}
      </div>

      {hasCameraPermission === false && (
          <Alert variant="destructive">
            <QrCode className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access to scan QR codes.
            </AlertDescription>
          </Alert>
      )}
    </div>
  );
}
