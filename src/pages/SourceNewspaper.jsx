import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const SourceNewspaper = () => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const topSources = [
    "Nobroker", "OLX", "99acres", "realestateindia", "My Gate", 
    "Housing", "Square yards", "Home Online", "Magicbricks", 
    "Manual Calling", "WhatsApp", "Field", "Facebook"
  ];

  const newspapers = ["Divya Bhaskar", "Sandesh", "Gujarat Samachar"];

  return (
    <div className="bg-purple-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Top Sources Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 flex flex-col items-center">
          Top Sources
          <div className="w-16 h-1 bg-blue-500 mt-2"></div>
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
  {topSources.map((source, index) => (
    <Link 
      key={index} 
      to={`/fourcategories?campanyname=${encodeURIComponent(source)}`}
      className="block"
    >
      <div 
        className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg hover:shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-28 text-white transition duration-300 transform hover:scale-105"
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 w-8 h-8 text-white"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
        <div >
          {/* Placeholder for icon, replace with actual icon if needed */}
        </div>
        <span className="text-lg sm:text-xl font-bold">{source}</span>
        <span className="text-sm sm:text-base opacity-80">Property listings</span>
      </div>
    </Link>
  ))}
</div>

      </div>

      {/* Newspaper Section */}
      <div className="mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 flex flex-col items-center">
          News Paper
          <div className="w-16 h-1 bg-blue-500 mt-2"></div>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
  {newspapers.map((source, index) => (
    <Link 
      key={index} 
      to={`/fourcategories?campanyname=${encodeURIComponent(source)}`}
      className="block w-full sm:w-auto"
    >
      <div 
        className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg hover:shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center min-w-72 h-full text-white transition duration-300 transform hover:scale-105"
      >
        <div >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 w-8 h-8 text-white"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
          {/* Placeholder for icon, replace with an actual icon component if needed */}
        </div>
        <span className="text-lg sm:text-xl font-bold">{source}</span>
        <span className="text-sm sm:text-base opacity-80">Property listings</span>
      </div>
    </Link>
  ))}
</div>

      </div>

      {/* File Upload Section */}
      <Link to="/categories" className="block">
        <div 
          className="bg-gray-100 rounded-lg mt-14 shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-col items-center">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">.CSV, .XLSX</p>
                {fileName && <p className="mt-2 text-sm text-blue-600">{fileName}</p>}
              </div>
              <input 
                type="file" 
                accept=".csv,.xlsx" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
          
          {data.length > 0 && (
            <div className="mt-6">
              <div className="text-left text-sm bg-white p-4 rounded-lg shadow-md overflow-auto max-h-60">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
    </div>
  );
};

export default SourceNewspaper;