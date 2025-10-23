"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Cpu } from "lucide-react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Card, CardContent } from "@/components/ui/card";

export default function ProductImageGallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const vpsFeatures = [
    "Ubuntu 22.04 LTS",
    "1 vCPU Performance",
    "1GB DDR4 RAM",
    "20GB NVMe SSD",
    "99.9% Uptime SLA",
    "DDoS Protection"
  ];

  return (
    <div className="sticky top-20 space-y-4">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "var(--primary)",
            "--swiper-pagination-color": "var(--primary)"
          } as React.CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2">
        {vpsFeatures.map((feature, key) => (
          <SwiperSlide key={key}>
            <div className="flex aspect-3/2 w-full items-center justify-center rounded-lg border bg-muted lg:aspect-square">
              <div className="flex flex-col items-center gap-4 text-center">
                <Cpu className="h-24 w-24 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Basic VPS Plan</h3>
                  <p className="text-sm text-muted-foreground">{feature}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-2">
        {vpsFeatures.map((feature, key) => (
          <SwiperSlide key={key} className="group">
            <figure className="group-[.swiper-slide-thumb-active]:border-primary overflow-hidden rounded-lg border opacity-70 group-[.swiper-slide-thumb-active]:opacity-100!">
              <div className="flex aspect-square w-full items-center justify-center bg-muted">
                <div className="text-center">
                  <Cpu className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">{feature.split(' ')[0]}</p>
                </div>
              </div>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
