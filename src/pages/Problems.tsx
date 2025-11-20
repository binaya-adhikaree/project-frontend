import { problemData } from ".";
import React from "react";
import { HoverEffect } from "../components/card-hover-effect"; 

interface ProblemItem {
  title: string;
  solution: string;
  image: string;
}

const Problems: React.FC = () => {
  const hoverItems = problemData.map((item: ProblemItem) => ({
    title: item.title,
    description: item.solution,
    link: "#", 
    image: item.image, 
  }));


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#22222] mb-6 leading-tight">
            Welches Fettabscheiderprotokoll <br className="hidden lg:block" />
            Der Betreiber erledigt das für Sie?
          </h1>
          <p className="text-xl lg:text-2xl font-semibold text-[#44444] max-w-3xl mx-auto">
            Betreiben Sie Ihr unternehmenskritisches Unternehmen besser<br />
            Effektiv und profitabel
          </p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-center text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
            Unsere Lösung für
          </h2>
          
          <HoverEffect items={hoverItems} />
        </div>
      </div>
    </div>
  );
};

export default Problems;