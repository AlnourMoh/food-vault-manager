
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const RestaurantLogos = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Restaurant data
  const restaurants = [
    {
      name: "مطعم الأصيل",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      description: "أشهى المأكولات الشرقية"
    },
    {
      name: "مطعم البحر",
      logo: "https://images.unsplash.com/photo-1599458448510-59aecaea4752?w=800&auto=format&fit=crop&q=60",
      description: "مأكولات بحرية طازجة"
    },
    {
      name: "مطعم الريف",
      logo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60",
      description: "أطباق تقليدية شهية"
    },
    {
      name: "مطعم السلطان",
      logo: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=60",
      description: "مأكولات شامية أصيلة"
    },
    {
      name: "مطعم النخبة",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      description: "أطباق عالمية مميزة"
    },
    {
      name: "مطعم الشرق",
      logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60",
      description: "نكهات شرقية أصيلة"
    },
    {
      name: "مطعم الياسمين",
      logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=60",
      description: "مأكولات عربية تقليدية"
    },
    {
      name: "مطعم اللوتس",
      logo: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&auto=format&fit=crop&q=60",
      description: "أطباق آسيوية مميزة"
    },
    {
      name: "مطعم الزيتون",
      logo: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=60",
      description: "مطبخ متوسطي فاخر"
    },
    {
      name: "مطعم القمر",
      logo: "https://images.unsplash.com/photo-1471253794676-0f039a6c6c2d?w=800&auto=format&fit=crop&q=60",
      description: "تجربة طعام فريدة"
    },
    {
      name: "مطعم الوردة",
      logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
      description: "أطباق محلية أصيلة"
    },
    {
      name: "مطعم النعناع",
      logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
      description: "وجبات صحية ولذيذة"
    },
    {
      name: "مطعم البرج",
      logo: "https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=800&auto=format&fit=crop&q=60",
      description: "مأكولات عالمية متنوعة"
    },
    {
      name: "مطعم الفردوس",
      logo: "https://images.unsplash.com/photo-1554679665-f5537f187268?w=800&auto=format&fit=crop&q=60",
      description: "نكهات شرقية فريدة"
    },
    {
      name: "مطعم المدينة",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60",
      description: "تراث المطبخ المحلي"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            المطاعم المشاركة
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            نفخر بشراكتنا مع أفضل المطاعم في المنطقة
          </motion.p>
        </div>

        {isClient && (
          <div className="relative overflow-hidden">
            <div className="infinite-scroll-container">
              <div className="infinite-scroll-track">
                {/* First set of restaurants */}
                {restaurants.map((restaurant, index) => (
                  <div key={`first-${index}`} className="inline-block px-2 md:px-4 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <Card className="overflow-hidden group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="aspect-[4/3] relative mb-4 overflow-hidden bg-gray-100">
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-center">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">{restaurant.description}</p>
                      </div>
                    </Card>
                  </div>
                ))}
                {/* Second set of restaurants (exact duplicate for seamless loop) */}
                {restaurants.map((restaurant, index) => (
                  <div key={`second-${index}`} className="inline-block px-2 md:px-4 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <Card className="overflow-hidden group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="aspect-[4/3] relative mb-4 overflow-hidden bg-gray-100">
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-center">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">{restaurant.description}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/80 to-transparent z-10 dark:from-background/80 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/80 to-transparent z-10 dark:from-background/80 pointer-events-none" />
          </div>
        )}

        <style>
          {`
          .infinite-scroll-container {
            width: 100%;
            overflow: hidden;
            position: relative;
          }
          
          .infinite-scroll-track {
            display: flex;
            white-space: nowrap;
            will-change: transform;
            animation: infiniteScroll 120s linear infinite;
          }
          
          @keyframes infiniteScroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default RestaurantLogos;
