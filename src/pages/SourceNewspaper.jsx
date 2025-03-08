import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { gsap } from 'gsap';

const SourceNewspaper = () => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");

  // Refs for GSAP animations
  const topSourcesRef = useRef([]);
  const newspapersRef = useRef([]);
  const fileUploadRef = useRef(null);

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

  // GSAP Animations
  useEffect(() => {
    // Animate Top Sources
    topSourcesRef.current.forEach((el, index) => {
      // Entrance Animation
      gsap.fromTo(
        el,
        { 
          opacity: 0, 
          scale: 0.5, 
          y: 50 
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          delay: index * 0.1,
          ease: "back.out(1.7)"
        }
      );

      // Hover and Click Animations
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.05,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#F4CCD2',
          duration: 0.3
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          boxShadow: 'none',
          backgroundColor: 'rgb(229 231 235)', // bg-gray-200
          duration: 0.3
        });
      });

      el.addEventListener('click', () => {
        gsap.to(el, {
          scale: 0.95,
          duration: 0.1,
          onComplete: () => {
            gsap.to(el, {
              scale: 1,
              duration: 0.1
            });
          }
        });
      });
    });

    // Animate Newspapers
    newspapersRef.current.forEach((el, index) => {
      // Entrance Animation
      gsap.fromTo(
        el,
        { 
          opacity: 0, 
          scale: 0.5, 
          x: 50 
        },
        { 
          opacity: 1, 
          scale: 1, 
          x: 0, 
          duration: 0.5, 
          delay: index * 0.1,
          ease: "back.out(1.7)"
        }
      );

      // Hover and Click Animations
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.05,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#F4CCD2',
          duration: 0.3
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          boxShadow: 'none',
          backgroundColor: 'rgb(229 231 235)', // bg-gray-200
          duration: 0.3
        });
      });

      el.addEventListener('click', () => {
        gsap.to(el, {
          scale: 0.95,
          duration: 0.1,
          onComplete: () => {
            gsap.to(el, {
              scale: 1,
              duration: 0.1
            });
          }
        });
      });
    });

    // Animate File Upload
    if (fileUploadRef.current) {
      gsap.fromTo(
        fileUploadRef.current,
        { 
          opacity: 0, 
          y: 50 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          ease: "power2.out"
        }
      );

      // Hover Animation for File Upload
      fileUploadRef.current.addEventListener('mouseenter', () => {
        gsap.to(fileUploadRef.current, {
          scale: 1.02,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          duration: 0.3
        });
      });

      fileUploadRef.current.addEventListener('mouseleave', () => {
        gsap.to(fileUploadRef.current, {
          scale: 1,
          boxShadow: 'none',
          duration: 0.3
        });
      });
    }
  }, []);

  const topSources = [
    "Nobroker", "OLX", "99acres", "realestateindia", "My Gate", 
    "Housing", "Square yards", "Home Online", "Magicbricks", 
    "Manual Calling", "WhatsApp", "Field", "Facebook"
  ];

  const newspapers = ["Divya Bhaskar", "Sandesh", "Gujarat Samachar"];

  return (
    <div className="bg-purple-100">
    <div className="  max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Top Sources Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-8">
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
                ref={el => topSourcesRef.current[index] = el}
                className="bg-gray-200 rounded-lg shadow hover:shadow-md p-3 sm:p-4 flex items-center justify-center text-center h-full min-h-16 text-sm sm:text-base font-semibold text-gray-800 hover:bg-gray-300 transition duration-300"
              >
                {source}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newspaper Section */}
      <div className="bg-[url('https://i.pinimg.com/736x/32/41/3b/32413b63c2dbb53370fe0c974a5494e4.jpg')]  rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-8">
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
                ref={el => newspapersRef.current[index] = el}
                className="bg-gray-200 rounded-lg shadow hover:shadow-md p-4 flex items-center justify-center text-center min-w-72 h-full text-sm sm:text-base font-semibold text-gray-800 hover:bg-gray-300 transition duration-300"
              >
                {source}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* File Upload Section */}
      <Link to="/categories" className="block">
        <div 
          ref={fileUploadRef}
          className="bg-gray-100 rounded-lg shadow-sm p-4 sm:p-6"
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