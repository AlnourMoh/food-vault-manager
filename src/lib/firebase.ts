
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
  
  // For demo purposes, add some registered products that haven't been added to inventory yet
  if (docRef.path.includes('products') && !docRef.path.includes('12345')) {
    const registeredProducts = {
      '67890': {
        name: 'دقيق',
        category: 'بقالة',
        quantity: 0,
        status: 'active',
        unit: 'كيلوغرام',
        created_at: { toDate: () => new Date() },
        updated_at: { toDate: () => new Date() },
        addedBy: 'إدارة النظام'
      },
      '54321': {
        name: 'طماطم',
        category: 'خضروات',
        quantity: 0,
        status: 'active',
        unit: 'كيلوغرام',
        created_at: { toDate: () => new Date() },
        updated_at: { toDate: () => new Date() },
        addedBy: 'إدارة النظام'
      }
    };
    
    // Extract the product ID from the path
    const pathParts = docRef.path.split('/');
    const productId = pathParts[pathParts.length - 1];
    
    if (registeredProducts[productId]) {
      return {
        exists: () => true,
        data: () => registeredProducts[productId],
      };
    }
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

// For querying collections
export const query = (collectionRef: any, ...queryConstraints: any[]) => {
  return {
    collectionRef,
    queryConstraints,
  };
};

export const where = (field: string, operator: string, value: any) => {
  return { field, operator, value, type: 'where' };
};

export const getDocs = async (queryObj: any) => {
  // Mock implementation for getDocs
  if (queryObj.collectionRef.path.includes('products')) {
    // Return mock registered products that haven't been added to inventory
    const mockProducts = [
      {
        id: '67890',
        name: 'دقيق',
        category: 'بقالة',
        quantity: 0,
        status: 'active',
        unit: 'كيلوغرام',
        created_at: { toDate: () => new Date() },
        updated_at: { toDate: () => new Date() },
        addedBy: 'إدارة النظام'
      },
      {
        id: '54321',
        name: 'طماطم',
        category: 'خضروات',
        quantity: 0,
        status: 'active',
        unit: 'كيلوغرام',
        created_at: { toDate: () => new Date() },
        updated_at: { toDate: () => new Date() },
        addedBy: 'إدارة النظام'
      }
    ];
    
    return {
      empty: false,
      docs: mockProducts.map(product => ({
        id: product.id,
        data: () => product,
        exists: () => true,
      })),
    };
  }
  
  return {
    empty: true,
    docs: [],
  };
};
