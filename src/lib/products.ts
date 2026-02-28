import * as XLSX from 'xlsx';

export interface Product {
  id: string;
  description: string;
  barcode: string;
  price: number;
  stock: number;
}

function parsePrice(value: any): number {
  if (!value) return 0;
  const str = String(value).replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

export async function loadProducts(): Promise<Product[]> {
  const response = await fetch('/data/produtos.xlsx');
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

  return rows.map((row: any) => {
    const id = String(row['ID'] || '');
    const description = String(row['Descrição'] || row['Descrição do Produto no Fornecedor'] || '').replace(/^\*/, '');
    const barcode = String(row['GTIN/EAN'] || '');
    const price = parsePrice(row['Preço de Compra']);
    const stock = parseInt(String(row['Estoque'] || '0'), 10) || 0;

    return { id, description, barcode, price, stock };
  }).filter(p => p.description);
}

export function searchByBarcode(products: Product[], barcode: string): Product | undefined {
  return products.find(p => p.barcode === barcode);
}

export function searchByName(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p => p.description.toLowerCase().includes(q)).slice(0, 20);
}
