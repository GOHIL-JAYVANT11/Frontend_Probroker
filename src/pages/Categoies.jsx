import axios from 'axios';
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { gsap } from 'gsap';

const sources = [
  "Nobroker", "OLX", "99acres", "realestateindia", "My Gate", "Housing",
  "Square yards", "Home Online", "Magicbricks", "Manual Calling",
  "WhatsApp", "Field", "Facebook"
];

const newspapers = ["Divya Bhaskar", "Sandesh", "Gujarat Samachar"];

const categories = {
  default: [
    { type: "Residential Rent", icon: "🏡" },
    { type: "Residential Sell", icon: "🏢" },
    { type: "Commercial Rent", icon: "🏬" },
    { type: "Commercial Sell", icon: "🏙️" },
  ],
};

export default function SidebarWithFileUpload() {
  const [selected, setSelected] = useState("Nobroker");
  const [selectedCategory, setSelectedCategory] = useState(categories.default[0].type);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const fileInputRef = useRef(null);
  const sourcesRef = useRef([]);
  const newspapersRef = useRef([]);
  const categoriesRef = useRef([]);

  // GSAP Animations
  useEffect(() => {
    // Animate Top Sources
    gsap.fromTo(
      sourcesRef.current, 
      { opacity: 0, x: -50 }, 
      { 
        opacity: 1, 
        x: 0, 
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out"
      }
    );

    // Animate Newspapers
    gsap.fromTo(
      newspapersRef.current, 
      { opacity: 0, x: -50 }, 
      { 
        opacity: 1, 
        x: 0, 
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out"
      }
    );

    // Animate Categories
    gsap.fromTo(
      categoriesRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1,
        stagger: 0.2,
        duration: 0.5,
        ease: "back.out(1.7)"
      }
    );
  }, []);

  // Hover Animations for Sources and Newspapers
  const handleSourceHover = (ref) => {
    gsap.to(ref, {
      scale: 1.05,
      backgroundColor: '#4B5563', // dark gray
      color: 'white',
      duration: 0.3,
      ease: "power1.inOut"
    });
  };

  const handleSourceLeave = (ref) => {
    gsap.to(ref, {
      scale: 1,
      backgroundColor: '#FBBF24', // yellow-500
      color: 'black',
      duration: 0.3,
      ease: "power1.inOut"
    });
  };

  // Hover Animations for Categories
  const handleCategoryHover = (ref) => {
    gsap.to(ref, {
      scale: 1.1,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      duration: 0.3,
      ease: "power1.inOut"
    });
  };

  const handleCategoryLeave = (ref) => {
    gsap.to(ref, {
      scale: 1,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      duration: 0.3,
      ease: "power1.inOut"
    });
  };

  const uploadFileToBackend = async (file, company, category) => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${import.meta.env.VITE_BASE_URL}/data/upload-property/${encodeURIComponent(company)}/${encodeURIComponent(category)}`;
    console.log('URL:', url);

    setIsLoading(true);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload successful:', response.data);
      setSuccessMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setSuccessMessage('Failed to upload file.');
    } finally {
      // Ensure the loader is shown for at least 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File read successfully");
        const binaryStr = e.target.result;
        
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('Data:', jsonData);
        setData(jsonData);

        uploadFileToBackend(file, selected, selectedCategory);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("File input clicked");
    fileInputRef.current.click();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 left-4 md:hidden bg-blue-500 text-white p-3 rounded-md shadow-lg z-50"
      >
        {isSidebarOpen ? "✖ Close" : "☰ Menu"}
      </button>
      
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 bg-white h-screen w-64 md:w-1/4 lg:w-1/5 p-4 overflow-y-auto transition-transform duration-300 text-black ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        {/* Top Sources Header */}
        <h2 className="text-lg font-bold mb-4 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg text-white rounded">
          Top Sources
        </h2>

        {/* Top Sources List */}
        <ul>
          {sources.map((source, index) => (
            <li 
              key={source} 
              className="mb-2"
              ref={(el) => sourcesRef.current[index] = el}
            >
              <Link to={`/Categories?companyname=${encodeURIComponent(source)}`}>
                <button
                  onMouseEnter={() => handleSourceHover(sourcesRef.current[index])}
                  onMouseLeave={() => handleSourceLeave(sourcesRef.current[index])}
                  onClick={() => setSelected(source)}
                  className={`w-full text-black text-left px-4 py-3 rounded-md transition-all ${
                    selected === source ? "bg-gray-700 text-white" : "bg-yellow-500"
                  }`}
                >
                  {source}
                </button>
              </Link>
            </li>
          ))}
        </ul>

        {/* Newspaper Header */}
        <h2 className="text-lg font-bold my-4 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg text-white rounded">
          Newspapers
        </h2>

        {/* Newspaper List */}
        <ul>
          {newspapers.map((paper, index) => (
            <li 
              key={paper} 
              className="mb-2"
              ref={(el) => newspapersRef.current[index] = el}
            >
              <button
                onMouseEnter={() => handleSourceHover(newspapersRef.current[index])}
                onMouseLeave={() => handleSourceLeave(newspapersRef.current[index])}
                onClick={() => setSelected(paper)}
                className={`w-full text-black text-left px-4 py-3 rounded-md transition-all ${
                  selected === paper ? "bg-gray-700 text-white" : "bg-yellow-500"
                }`}
              >
                {paper}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
      <Link to={`/sorcenewspaper`}>  
      <button class="fixed top-10 left-96   bg-white px-4 py-2 flex items-center gap-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
        <img src="https://cdn-icons-png.flaticon.com/512/189/189254.png" alt="Icon" class="w-6 h-6"/>
        <span class="text-sm font-medium text-gray-700">Click Me</span>
    </button>
    </Link> 
        {/* Selected Source Title */}
        <div className="text-2xl md:text-3xl font-bold mb-6 bg-blue-400 h-16 w-3/4 md:w-1/2 lg:w-72 flex items-center justify-center rounded-lg shadow-lg">
          {selected}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.default.map((item, index) => (
            <Link 
              key={item.type} 
              to={`/Categories?companyname=${encodeURIComponent(selected)}&category=${encodeURIComponent(item.type)}`}
              ref={(el) => categoriesRef.current[index] = el}
            >
              <div
                onMouseEnter={() => handleCategoryHover(categoriesRef.current[index])}
                onMouseLeave={() => handleCategoryLeave(categoriesRef.current[index])}
                className="bg-white p-6 h-32 w-64 sm:w-72 md:w-80 rounded-2xl shadow-lg flex items-center space-x-4 transition-all text-black cursor-pointer"
                onClick={() => handleCategoryClick(item.type)}
              >
                <div className="text-5xl md:text-6xl">{item.icon}</div>
                <p className="text-gray-700 text-lg font-bold">{item.type}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Loader */}
        {isLoading && <div className="loader">Uploading...</div>}

        {/* Success Message */}
        {successMessage && (
          <div className="popup bg-white text-black p-4 rounded shadow-lg mt-4">
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="ml-4 bg-blue-500 text-white px-2 py-1 rounded">Close</button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept=".csv,.xlsx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}