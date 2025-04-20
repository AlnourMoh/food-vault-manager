
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"

const RestaurantLogos = () => {
  const autoplay = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  // بيانات تجريبية للمطاعم المشاركة
  const restaurants = [
    {
      name: "مطعم الأصيل",
      logo: "/placeholder.svg",
      description: "أشهى المأكولات الشرقية"
    },
    {
      name: "مطعم البحر",
      logo: "/placeholder.svg",
      description: "مأكولات بحرية طازجة"
    },
    {
      name: "مطعم الريف",
      logo: "/placeholder.svg",
      description: "أطباق تقليدية شهية"
    },
    {
      name: "مطعم السلطان",
      logo: "/placeholder.svg",
      description: "مأكولات شامية أصيلة"
    },
    {
      name: "مطعم النخبة",
      logo: "/placeholder.svg",
      description: "أطباق عالمية مميزة"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المطاعم المشاركة</h2>
          <p className="text-muted-foreground">نفخر بشراكتنا مع أفضل المطاعم في المنطقة</p>
        </div>

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
                <Card className="p-4 h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-square relative mb-4 bg-purple-100/50 rounded-lg overflow-hidden">
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-center">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground text-center">{restaurant.description}</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default RestaurantLogos;
