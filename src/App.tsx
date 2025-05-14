
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductBarcodes from './pages/ProductBarcodes';
import CameraTest from './pages/CameraTest';
import BarcodeScannerTest from './pages/BarcodeScannerTest';

// Import Tailwind CSS
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:productId/barcodes" element={<ProductBarcodes />} />
        <Route path="/restaurant/product/:productId/barcodes" element={<ProductBarcodes />} />
        <Route path="/camera-test" element={<CameraTest />} />
        <Route path="/barcode-scanner" element={<BarcodeScannerTest />} />
        <Route path="/" element={
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">اختبار مكونات التطبيق</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/barcode-scanner" className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-2">اختبار قارئ الباركود</h2>
                <p className="text-gray-600">اختبار قراءة الباركود باستخدام كاميرا الجهاز</p>
              </a>
              <a href="/camera-test" className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-2">اختبار الكاميرا</h2>
                <p className="text-gray-600">اختبار إمكانيات الكاميرا والأذونات</p>
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
