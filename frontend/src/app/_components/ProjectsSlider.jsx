"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectsSlider({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 3;
  const maxIndex = projects.length - itemsPerView;

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div dir="ltr" className="relative w-full mt-12">
      {/* Arrows */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center
        bg-white/10 backdrop-blur-md border border-white/10
        transition-all duration-300
        ${
          currentIndex === 0
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-primary hover:scale-110 hover:text-white cursor-pointer"
        }`}
      >
        ←
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center
        bg-white/10 backdrop-blur-md border border-white/10
        transition-all duration-300 
        ${
          currentIndex === maxIndex
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-primary hover:scale-110 hover:text-white cursor-pointer"
        }`}
      >
        →
      </button>

      {/* Slider Container */}
      <div className="overflow-hidden px-14">
        <div
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-[calc(100%/3-16px)] 
              bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-3xl p-6 flex flex-col gap-4 
              transition-all duration-300 
              hover:shadow-lg hover:shadow-primary/20 
              hover:-translate-y-1
              cursor-pointer"
            >
              <div className="w-full h-40 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                {project.image && (
                  <Image
                    src={project.image}
                    fill
                    alt={project.title}
                    className="object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                )}
              </div>

              <h3
                dir="auto"
                className="text-xl font-sans text-left font-bold text-white"
              >
                {project.title}
              </h3>

              <p
                dir="auto"
                className="text-gray-400 text-sm leading-relaxed text-justify text-left font-sans font-normal"
              >
                {project.description}
              </p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  className="mt-auto px-4 py-2 rounded-xl bg-secondary text-black font-semibold text-center transition-colors duration-300 hover:bg-primary"
                >
                  View
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
