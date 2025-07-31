'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrScanner } from '@/components/ui/qr-scanner';
import { QrCode } from 'lucide-react';

interface ScanQrDialogProps {
  taskId: string;
  onScanSuccess: () => void;
}

export function ScanQrDialog({ taskId, onScanSuccess }: ScanQrDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <QrCode className="mr-2 h-4 w-4" />
          Scan &amp; Start Delivery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Package QR Code</DialogTitle>
          <DialogDescription>
            Please scan the QR code on the package for task {taskId} to confirm
            pickup.
          </DialogDescription>
        </DialogHeader>
        <QrScanner
          expectedValue={taskId}
          onScanSuccess={() => {
            onScanSuccess();
          }}
        />
        <DialogClose asChild>
          <Button variant="outline" className="mt-4">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
