import axios from 'axios';
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const sources = [
  "Nobroker", "OLX", "99acres", "realestateindia", "My Gate", 
    "Housing", "Square yards", "Home Online", "Magicbricks", 
    "Manual Calling", "WhatsApp", "Field", "Facebook"
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

  const uploadFileToBackend = async (file, company, category) => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `http://54.162.19.212:4000/data/upload-property/${encodeURIComponent(company)}/${encodeURIComponent(category)}`;
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
        className={`fixed md:relative z-40 bg-gray-700 h-screen w-64 md:w-1/4 lg:w-1/5 p-4 overflow-y-auto transition-transform duration-300 text-black ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        {/* Top Sources Header */}
        <h2 className="text-lg font-bold mb-4 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg text-white rounded">
          Top Sources
        </h2>

        {/* Top Sources List */}
        <ul>
          {sources.map((source) => (
            <li 
              key={source} 
              className="mb-2"
            >
              <Link to={`/Categories?companyname=${encodeURIComponent(source)}`}>
                <button
                  onClick={() => setSelected(source)}
                  className={`w-full text-black text-left px-4 py-3 rounded-md transition-all ${
                    selected === source ? "bg-gray-900 text-white" : " bg-gray-50"
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
          {newspapers.map((paper) => (
            <li 
              key={paper} 
              className="mb-2"
            >
              <button
                onClick={() => setSelected(paper)}
                className={`w-full text-black text-left px-4 py-3 rounded-md transition-all ${
                  selected === paper ? "bg-gray-900 text-white" : " bg-gray-50"
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
      <button className="fixed top-10 left-96 bg-white px-4 py-2 flex items-center gap-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
        <img src="https://cdn-icons-png.flaticon.com/512/189/189254.png" alt="Icon" className="w-6 h-6"/>
        <span className="text-sm font-medium text-gray-700">Click Me</span>
    </button>
    </Link> 
        {/* Selected Source Title */}
        <div className="text-2xl md:text-3xl font-bold mb-6 bg-blue-400 h-16 w-3/4 md:w-1/2 lg:w-72 flex items-center justify-center rounded-lg shadow-lg">
          {selected}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.default.map((item) => (
            <Link 
              key={item.type} 
              to={`/Categories?companyname=${encodeURIComponent(selected)}&category=${encodeURIComponent(item.type)}`}
            >
              <div
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