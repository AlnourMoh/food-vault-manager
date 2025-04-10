
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
  console.log("Mock getDoc called for path:", docRef.path);
  
  // For demo purposes, create a map of product IDs to their mock data
  const mockProducts: Record<string, any> = {
    '12345': {
      name: 'زيت زيتون',
      description: 'وصف لزيت الزيتون',
      category: 'بقالة',
      quantity: 0,
      status: 'active',
      unit: 'لتر',
      created_at: { toDate: () => new Date() },
      updated_at: { toDate: () => new Date() },
      addedBy: 'سارة الاحمد'
    },
    '54321': {
      name: 'طماطم',
      description: 'طماطم طازجة',
      category: 'خضروات',
      quantity: 0,
      status: 'active',
      unit: 'كيلوغرام',
      created_at: { toDate: () => new Date() },
      updated_at: { toDate: () => new Date() },
      addedBy: 'سارة الاحمد'
    },
    '67890': {
      name: 'دقيق',
      description: 'دقيق عالي الجودة',
      category: 'بقالة',
      quantity: 0,
      status: 'active',
      unit: 'كيلوغرام',
      created_at: { toDate: () => new Date() },
      updated_at: { toDate: () => new Date() },
      addedBy: 'سارة الاحمد'
    }
  };
  
  // Extract the product ID from the path
  const pathParts = docRef.path.split('/');
  const productId = pathParts[pathParts.length - 1];
  
  console.log("Looking for product with ID:", productId);
  
  // Check if we have a mock product with this ID
  if (mockProducts[productId]) {
    console.log("Found mock product:", mockProducts[productId].name);
    return {
      exists: () => true,
      data: () => mockProducts[productId],
      id: productId
    };
  }
  
  console.log("Product not found in mock data");
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
  console.log("Mock getDocs called with query:", queryObj);
  
  // Check if we're querying for products
  if (queryObj.collectionRef && queryObj.collectionRef.path && queryObj.collectionRef.path.includes('products')) {
    // Return mock registered products that haven't been added to inventory yet
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
        addedBy: 'سارة الاحمد'
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
        addedBy: 'سارة الاحمد'
      },
      {
        id: '12345',
        name: 'زيت زيتون',
        category: 'بقالة',
        quantity: 0,
        status: 'active',
        unit: 'لتر',
        created_at: { toDate: () => new Date() },
        updated_at: { toDate: () => new Date() },
        addedBy: 'سارة الاحمد'
      }
    ];
    
    console.log("Returning mock products:", mockProducts.length);
    
    return {
      empty: false,
      docs: mockProducts.map(product => ({
        id: product.id,
        data: () => product,
        exists: () => true,
      })),
    };
  }
  
  console.log("No mock data available for this query, returning empty result");
  return {
    empty: true,
    docs: [],
  };
};
