
// Mock Firebase configuration for the application

// Mock database instance
export const db = {
  // This is a mock implementation to allow the code to compile
  // Real implementation would connect to Firebase
};

// Mock Firestore functions
export const mockFirestore = {
  collection: (db: any, path: string) => ({
    path,
    // Add other collection methods as needed
  }),
  doc: (db: any, path: string) => ({
    path,
    // Add other document methods as needed
  }),
  getDoc: async () => ({
    exists: () => false,
    data: () => ({}),
  }),
  updateDoc: async () => {},
  addDoc: async () => ({ id: 'mock-doc-id' }),
  increment: (val: number) => val,
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
  },
  serverTimestamp: () => new Date(),
};
