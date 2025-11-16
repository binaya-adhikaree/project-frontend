import { problemData } from ".";
import React from "react";

interface ProblemItem {
  title: string;
  solution: string;
  image: string;
}

const Problems: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welches Fettabscheiderprotokoll <br className="hidden lg:block" />
            Der Betreiber erledigt das für Sie?
          </h1>
          <p className="text-xl lg:text-2xl font-semibold text-gray-600 max-w-3xl mx-auto">
            Betreiben Sie Ihr unternehmenskritisches Unternehmen besser<br />
            Effektiv und profitabel
          </p>
        </div>
        <div className="mb-12">
          <h2 className="text-center text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
            Unsere Lösung für
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {problemData.map((item: ProblemItem, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group hover:-translate-y-2"
              >
                <div className="flex gap-4">
                  <div className=" flex">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
