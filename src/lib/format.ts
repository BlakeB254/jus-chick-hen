/**
 * Format cents to dollar string: 899 → "$8.99"
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format cents to dollar string without trailing zeros: 800 → "$8", 899 → "$8.99"
 */
export function formatPriceShort(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
