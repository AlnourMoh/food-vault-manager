import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"

const RestaurantLogos = () => {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  // بيانات المطاعم المشاركة مع صور حقيقية
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
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المطاعم المشاركة</h2>
          <p className="text-muted-foreground">نفخر بشراكتنا مع أفضل المطاعم في المنطقة</p>
        </div>

        <div className="relative px-8">
          <Carousel
            plugins={[autoplay.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {restaurants.map((restaurant, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                  <Card className="overflow-hidden group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-[4/3] relative mb-4 overflow-hidden bg-gray-100">
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-center">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground text-center">{restaurant.description}</p>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-2" />
            <CarouselNext className="hidden md:flex -right-2" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogos;
