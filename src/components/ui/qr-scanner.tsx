
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
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
            setHasCameraPermission(true);
        } else {
            setHasCameraPermission(false);
        }
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
    getCameraPermission();
  }, [toast]);
  
  useEffect(() => {
    if (hasCameraPermission) {
        scannerRef.current = new Html5Qrcode('qr-reader-container');
        startScanner();
    }
    
    const stopScanner = () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };

    const startScanner = () => {
        if (scannerRef.current && !scannerRef.current.isScanning) {
            scannerRef.current.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    if (decodedText === expectedValue) {
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
    }

    return () => {
      stopScanner();
    };

  }, [hasCameraPermission, onScanSuccess, expectedValue, toast]);


  return (
    <div className="space-y-4">
      <div id="qr-reader-container" className="w-full aspect-video rounded-md bg-muted flex items-center justify-center">
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
