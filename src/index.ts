import { Schema } from './schema';
export { string, integer, float, boolean } from './schema';
export function schema(...args) {
  return new Schema(...args);
}