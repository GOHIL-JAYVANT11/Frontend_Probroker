import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

  // Update selected from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sourceName = params.get("campanyname");
    if (sourceName) {
      setSelected(sourceName);
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-800 justify-center items-center">
      <Link to={`/sorcenewspaper`}>  
        <button className="fixed top-10 left-8 bg-white px-4 py-2 flex items-center gap-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300 ease-out">
          <img src="https://cdn-icons-png.flaticon.com/512/189/189254.png" alt="Icon" className="w-6 h-6"/>
          <span className="text-sm font-medium text-gray-700">Click Me</span>
        </button>
      </Link> 
      {/* Main Container */}
      <div className="w-full max-w-4xl p-10 text-center">
        {/* Selected Source Title */}
        <div className="text-3xl font-bold mb-10 flex items-center justify-center bg-yellow-400 h-16 w-72 mx-auto rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 ease-out hover:-translate-y-2">
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
                className="bg-white p-8 h-36 w-80 rounded-2xl shadow-xl flex items-center space-x-6 transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="text-6xl transition-transform duration-300 ease-out hover:scale-110">{item.icon}</div>
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