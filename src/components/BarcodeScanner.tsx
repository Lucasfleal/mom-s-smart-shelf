import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'barcode-reader';

  const startScanner = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 150 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err: any) {
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id={containerId}
        className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-primary/30 bg-muted"
        style={{ minHeight: isScanning ? 300 : 0, display: isScanning ? 'block' : 'none' }}
      />

      {!isScanning && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/20 bg-secondary/50 p-8 w-full max-w-sm">
          <div className="rounded-full bg-primary/10 p-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Aponte a câmera para o código de barras do produto
          </p>
        </div>
      )}

      <Button
        onClick={isScanning ? stopScanner : startScanner}
        size="lg"
        className="w-full max-w-sm gap-2 text-base font-semibold"
        variant={isScanning ? 'secondary' : 'default'}
      >
        {isScanning ? (
          <>
            <CameraOff className="h-5 w-5" /> Parar Scanner
          </>
        ) : (
          <>
            <Camera className="h-5 w-5" /> Escanear Código de Barras
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
      )}
    </div>
  );
};

export default BarcodeScanner;
