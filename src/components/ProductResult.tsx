import { Product } from '@/lib/products';
import { Package, DollarSign, BarChart3 } from 'lucide-react';

interface ProductResultProps {
  product: Product | null;
  notFound?: boolean;
  searchedCode?: string;
}

const ProductResult = ({ product, notFound, searchedCode }: ProductResultProps) => {
  if (notFound) {
    return (
      <div className="w-full max-w-sm mx-auto rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <div className="mx-auto mb-3 rounded-full bg-destructive/10 p-3 w-fit">
          <Package className="h-6 w-6 text-destructive" />
        </div>
        <p className="font-semibold text-foreground">Produto não encontrado</p>
        <p className="text-sm text-muted-foreground mt-1">
          Código: <span className="font-mono">{searchedCode}</span>
        </p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl border border-accent/30 bg-card shadow-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-primary/5 px-6 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 mt-0.5">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Produto</p>
            <h3 className="font-display font-bold text-foreground text-lg leading-tight mt-0.5">
              {product.description}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Preço de Compra</p>
            <p className="text-2xl font-display font-bold text-foreground">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary p-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estoque</p>
            <p className="text-lg font-semibold text-foreground">{product.stock} un.</p>
          </div>
        </div>

        {product.barcode && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Código: <span className="font-mono">{product.barcode}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductResult;
