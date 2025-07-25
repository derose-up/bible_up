import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'web-streams-polyfill';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class {
    constructor() {}
  } as any;
}
