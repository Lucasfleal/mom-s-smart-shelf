import { useState, useEffect } from 'react';
import { Search, ScanBarcode, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductResult from '@/components/ProductResult';
import { loadProducts, searchByBarcode, searchByName, Product } from '@/lib/products';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchedCode, setSearchedCode] = useState('');
  const [nameResults, setNameResults] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleScan = (code: string) => {
    setSearchQuery('');
    setNameResults([]);
    setSearchedCode(code);
    const found = searchByBarcode(products, code);
    if (found) {
      setScannedProduct(found);
      setNotFound(false);
    } else {
      setScannedProduct(null);
      setNotFound(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setScannedProduct(null);
    setNotFound(false);
    setSearchedCode('');

    if (query.trim().length >= 2) {
      // Check if it's a barcode (all digits)
      if (/^\d{8,14}$/.test(query.trim())) {
        const found = searchByBarcode(products, query.trim());
        if (found) {
          setNameResults([]);
          setScannedProduct(found);
          return;
        }
      }
      setNameResults(searchByName(products, query));
    } else {
      setNameResults([]);
    }
  };

  const selectProduct = (product: Product) => {
    setScannedProduct(product);
    setNameResults([]);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2">
              <ScanBarcode className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Consulta Produtos</h1>
              <p className="text-xs text-muted-foreground">{products.length} produtos carregados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Search by name */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código de barras..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl bg-card"
          />
        </div>

        {/* Name search results */}
        {nameResults.length > 0 && (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {nameResults.map((product) => (
              <button
                key={product.id}
                onClick={() => selectProduct(product)}
                className="w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <p className="font-medium text-foreground text-sm">{product.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                  {product.barcode && <span className="ml-2 font-mono">• {product.barcode}</span>}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Barcode Scanner */}
        <BarcodeScanner onScan={handleScan} />

        {/* Result */}
        <ProductResult
          product={scannedProduct}
          notFound={notFound}
          searchedCode={searchedCode}
        />
      </main>
    </div>
  );
};

export default Index;
