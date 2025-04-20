
import React from 'react';
import { Phone, WhatsApp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
  const phoneCountryCode = "+974";
  const phoneNumber = "77479447";
  const fullPhoneNumber = phoneCountryCode + phoneNumber;
  
  const handlePhoneClick = () => {
    window.location.href = `tel:${fullPhoneNumber}`;
  };
  
  const handleWhatsAppClick = () => {
    window.location.href = `https://wa.me/${fullPhoneNumber}`;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          تواصل معنا
        </h2>
        <div className="space-y-6 text-gray-700">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handlePhoneClick}
            >
              <Phone className="h-4 w-4" />
              <span className="font-semibold">{phoneCountryCode}</span>
              <span>{phoneNumber}</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
              onClick={handleWhatsAppClick}
            >
              <WhatsApp className="h-4 w-4" />
              <span>واتساب</span>
            </Button>
          </div>
          
          <p className="text-lg">البريد الإلكتروني: info@hygiene-tech.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;

