import 'server-only';
import {PRODUCTS} from './config';

export function deepReadingAvailable() {
  return !!process.env.ANTHROPIC_API_KEY && process.env.READING_ENGINE!=='demo';
}
export function availableProducts() {
  return PRODUCTS.filter(product=>product.id!=='deep'||deepReadingAvailable());
}
