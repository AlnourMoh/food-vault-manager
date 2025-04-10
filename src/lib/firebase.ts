
// Mock Firebase configuration for the application

// Mock database instance
export const db = {
  // This is a mock implementation to allow the code to compile
  // Real implementation would connect to Firebase
};

// Mock Firestore functions that mimic Firebase's API
export const doc = (db: any, ...pathSegments: string[]) => {
  return {
    path: pathSegments.join('/'),
    // Add other document methods as needed
  };
};

export const getDoc = async (docRef: any) => {
  // For demo purposes, we'll say product with ID 12345 exists
  if (docRef.path.includes('12345')) {
    return {
      exists: () => true,
      data: () => ({
        name: 'منتج تجريبي',
        description: 'وصف للمنتج التجريبي',
        quantity: 10,
        expiryDate: {
          toDate: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days in the future
        }
      }),
    };
  }
  
  return {
    exists: () => false,
    data: () => ({}),
  };
};

export const collection = (db: any, ...pathSegments: string[]) => {
  return {
    path: pathSegments.join('/'),
    // Add other collection methods as needed
  };
};

export const updateDoc = async (docRef: any, data: any) => {
  console.log(`Mock updating document at ${docRef.path} with data:`, data);
  return Promise.resolve();
};

export const addDoc = async (collectionRef: any, data: any) => {
  console.log(`Mock adding document to ${collectionRef.path} with data:`, data);
  return { id: 'mock-doc-id' };
};

// Adding setDoc to match Firebase's API
export const setDoc = async (docRef: any, data: any) => {
  console.log(`Mock setting document at ${docRef.path} with data:`, data);
  return Promise.resolve();
};

export const increment = (val: number) => {
  console.log(`Mock increment by ${val}`);
  return val;
};

export const Timestamp = {
  now: () => ({
    toDate: () => new Date(),
  }),
};

export const serverTimestamp = () => new Date();
