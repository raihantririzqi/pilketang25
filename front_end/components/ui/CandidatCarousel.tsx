"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import CandidateCard from "./CandidatCard";

type Candidate = {
  name: string;
  nim: string;
  base_color: string;
  kandidat_number: number;
  vision: string;
  missions: string[];
};

type Props = {
  data: Candidate[];
};

const CandidateCarousel = ({ data }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* CAROUSEL */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {data.map((candidate, index) => {
            const isActive = index === selectedIndex;

            return (
              <div
                key={index}
                className="flex-[0_0_100%] flex justify-center py-6"
              >
                <div
                  className={`
                    transition-all duration-300 ease-out
                    ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"}
                  `}
                >
                  <CandidateCard
                    name={candidate.name}
                    nim={candidate.nim}
                    base_color={candidate.base_color}
                    kandidat_number={candidate.kandidat_number}
                    vision={candidate.vision}
                    missions={candidate.missions}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {/* PREV */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white/80 backdrop-blur-md
            shadow transition-all duration-300
            active:scale-95
            ${canScrollPrev ? "opacity-100" : "opacity-30 cursor-not-allowed"}
          `}
          aria-label="Previous slide"
        >
          <span className="text-lg font-semibold">‹</span>
        </button>

        {/* DOTS */}
        <div className="flex items-center gap-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2.5 rounded-full transition-all duration-300
                ${index === selectedIndex ? "w-6 bg-black" : "w-2.5 bg-gray-300"}
              `}
            />
          ))}
        </div>

        {/* NEXT */}
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={`
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white/80 backdrop-blur-md
            shadow transition-all duration-300
            active:scale-95
            ${canScrollNext ? "opacity-100" : "opacity-30 cursor-not-allowed"}
          `}
          aria-label="Next slide"
        >
          <span className="text-lg font-semibold">›</span>
        </button>
      </div>
    </div>
  );
};

export default CandidateCarousel;
