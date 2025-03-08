import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

const categories = {
  default: [
    { type: "Residential Rent", icon: "🏡" },
    { type: "Residential Sell", icon: "🏢" },
    { type: "Commercial Rent", icon: "🏬" },
    { type: "Commercial Sell", icon: "🏙️" },
  ],
};

export default function SidebarWithCategories() {
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  // Initialize refs array
  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, categories.default.length);
  }, []);

  // Update selected from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sourceName = params.get("campanyname");
    if (sourceName) {
      setSelected(sourceName);
    }
  }, [location]);

  // Initial load animation
  useEffect(() => {
    // Animate title on load
    gsap.from(titleRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      clearProps: "all"
    });

    // Animate cards with stagger effect
    gsap.from(cardsRef.current, {
      scale: 0.5,
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
      clearProps: "all"
    });
  }, []);

  // Create hover animations for each card
  const handleMouseEnter = (index) => {
    gsap.to(cardsRef.current[index], {
      scale: 1.1,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      y: -10,
      duration: 0.3,
      ease: "power2.out"
    });

  };

  const handleMouseLeave = (index) => {
    gsap.to(cardsRef.current[index], {
      scale: 1,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    // Reset icon
    const iconElement = cardsRef.current[index].querySelector(".icon-element");
    gsap.to(iconElement, {
      rotate: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="flex h-screen bg-gray-800 justify-center items-center">
      <Link to={`/sorcenewspaper`}>  
      <button class="fixed top-10 left-8   bg-white px-4 py-2 flex items-center gap-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
        <img src="https://cdn-icons-png.flaticon.com/512/189/189254.png" alt="Icon" class="w-6 h-6"/>
        <span class="text-sm font-medium text-gray-700">Click Me</span>
    </button>
    </Link> 
      {/* Main Container */}
      <div className="w-full max-w-4xl p-10 text-center">
        {/* Selected Source Title */}
        <div 
          ref={titleRef}
          className="text-3xl font-bold mb-10 flex items-center justify-center bg-yellow-400 h-16 w-72 mx-auto rounded-lg shadow-lg overflow-hidden"
        >
          {selected || "Select a Source"}
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-2 gap-8 justify-center">
          {categories.default.map((item, index) => (
            <Link
              key={index}
              to={`/listpage?campanyname=${encodeURIComponent(selected)}&subCom=${encodeURIComponent(item.type)}`}
            >
              <div
                ref={el => cardsRef.current[index] = el}
                className="bg-white p-8 h-36 w-80 rounded-2xl shadow-xl flex items-center space-x-6"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <div className="text-6xl icon-element">{item.icon}</div>
                <div>
                  <p className="text-gray-700 text-lg font-bold">{item.type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}