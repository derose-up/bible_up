export const db = {}; // OK

export const collection = jest.fn(() => ({}));
export const query = jest.fn(() => ({}));
export const orderBy = jest.fn(() => ({}));
export const getDocs = jest.fn();

export const doc = jest.fn(() => ({}));
export const updateDoc = jest.fn();
export const arrayUnion = jest.fn();
export const arrayRemove = jest.fn();
export const startAfter = jest.fn(() => ({}));
export const limit = jest.fn(() => ({}));
