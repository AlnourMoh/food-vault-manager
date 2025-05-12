
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be form handling logic
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            تواصل معنا
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600"
          >
            نحن هنا لمساعدتك. لا تتردد في التواصل معنا بأي طريقة تناسبك.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-1"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">اتصل بنا</h3>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600" 
                        onClick={handlePhoneClick}
                      >
                        <span className="font-semibold">{phoneCountryCode}</span> {phoneNumber}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">واتساب</h3>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-green-600"
                        onClick={handleWhatsAppClick}
                      >
                        تواصل عبر واتساب
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">البريد الإلكتروني</h3>
                      <a href="mailto:info@hygiene-tech.com" className="text-purple-600 hover:underline">
                        info@hygiene-tech.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-2"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-6">أرسل لنا رسالة</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">الاسم</label>
                    <Input id="name" placeholder="أدخل اسمك" />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
                    <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">الرسالة</label>
                    <Textarea id="message" placeholder="اكتب رسالتك هنا" className="min-h-32" />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      إرسال الرسالة
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
