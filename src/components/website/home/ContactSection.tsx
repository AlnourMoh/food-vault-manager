
import React from 'react';

const ContactSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          تواصل معنا
        </h2>
        <div className="space-y-4 text-gray-700">
          <p className="text-lg">هاتف: +966 500000000</p>
          <p className="text-lg">البريد الإلكتروني: info@hygiene-tech.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
