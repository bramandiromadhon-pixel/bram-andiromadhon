export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace('Rp', 'Rp ');
}

export function generateOrderId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SIG-2026-${randomSuffix}`;
}

export function generateTrackingNumber(courierName: string): string {
  const prefix = courierName.toUpperCase().includes('JNE')
    ? 'JNE'
    : courierName.toUpperCase().includes('SICEPAT')
    ? 'SCP'
    : courierName.toUpperCase().includes('PAXEL')
    ? 'PXL'
    : 'EXP';
  const num = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}-${num}ID`;
}

export function generateVANumber(bankName: string): string {
  const bankPrefixes: { [key: string]: string } = {
    BCA: '8277',
    Mandiri: '8890',
    BNI: '9881',
    BRI: '1280',
    Permata: '8522'
  };
  const prefix = bankPrefixes[bankName] || '8000';
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix} ${random.toString().slice(0, 4)} ${random.toString().slice(4, 8)} ${random.toString().slice(8)}`;
}
