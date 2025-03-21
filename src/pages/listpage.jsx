import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function PropertyTable() {
  const [propertyData, setPropertyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companyname, setCompanyname] = useState("");
  const [categories, setCategories] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Add new filter states
  const [numberFilter, setNumberFilter] = useState("");
  const [premiseNameFilter, setPremiseNameFilter] = useState("");
  const [bhkFilter, setBhkFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  // Add new loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Delete functionality states
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ success: false, message: "" });

  const [selectAll, setSelectAll] = useState(false); // New state for Select All

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyname = params.get("campanyname");
    const categories = params.get("subCom");

    if (companyname) {
      setCompanyname(companyname);
      setCategories(categories);

      const fetchData = async () => {
        setIsLoading(true);
        try {
          let response;
          if (companyname && categories) {
            response = await axios.get(`http://54.162.19.212:4000/data/companydata/${encodeURIComponent(companyname)}/${encodeURIComponent(categories)}`);
            // Fetch all properties for the company
          } else {
            response = await axios.get(`http://54.162.19.212:4000/data/companydata/${encodeURIComponent(companyname)}`);
            // console.log(response)
            // Fetch properties for specific category
          }
          
          console.log("Response Status:", response.status);
          console.log("Response Data:", response.data);
          if (response.status === 200) {
            setPropertyData(response.data);
            setFilteredData(response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      console.log("Query parameters missing.");
    }
  }, []);

  useEffect(() => {
    if (propertyData.length > 0) {
      let filtered = [...propertyData];
      
      // Date filter
      if (selectedDate) {
        filtered = filtered.filter(item => {
          const itemDate = item.data.date ? item.data.date.split('T')[0] : '';
          return itemDate === selectedDate;
        });
      }
      
      // Number filter
      if (numberFilter) {
        filtered = filtered.filter(item => 
          item.data.number && item.data.number.toLowerCase().includes(numberFilter.toLowerCase())
        );
      }
      
      // Premise Name filter
      if (premiseNameFilter) {
        filtered = filtered.filter(item => 
          item.data.project_name && item.data.project_name.toLowerCase().includes(premiseNameFilter.toLowerCase())
        );
      }
      
      // BHK filter
      if (bhkFilter) {
        filtered = filtered.filter(item => 
          item.data.bhk && item.data.bhk.toString().toLowerCase().includes(bhkFilter.toLowerCase())
        );
      }
      
      // Area filter
      if (areaFilter) {
        filtered = filtered.filter(item => 
          item.data.area && item.data.area.toLowerCase().includes(areaFilter.toLowerCase())
        );
      }
      
      // Status filter
      if (statusFilter) {
        filtered = filtered.filter(item => 
          item.data.status && item.data.status === statusFilter
        );
      }
      
      setFilteredData(filtered);
    }
  }, [selectedDate, numberFilter, premiseNameFilter, bhkFilter, areaFilter, statusFilter, propertyData]);

  const handleFieldChange = async (id, key, value) => {
    // Update local state immediately
    setPropertyData((prevProperties) =>
      prevProperties.map((property) =>
        property._id === id ? { ...property, data: { ...property.data, [key]: value } } : property
      )
    );

    // Auto-save to backend
    try {
      const property = propertyData.find(p => p._id === id);
      const response = await axios.put(`http://54.162.19.212:4000/data/property/${id}`, {
        data: { ...property.data, [key]: value }
      });
      
      if (response.status === 200) {
        console.log('Auto-saved successfully');
      }
    } catch (error) {
      console.error('Error auto-saving:', error);
      // Optionally show a small notification to user if save failed
    }
  };

  const isFieldMissing = (field) => {
    return !field || field.trim() === "";
  };

  const statusOptions = ["Conform", "NA","Rent Out","Already Listed","Broker"];

  const handleEdit = async (property) => {
    try {
      const response = await axios.put(`http://54.162.19.212:4000/data/property/${property._id}`, {
        data: property.data
      });
      
      if (response.status === 200) {
        setPropertyData(prevData => 
          prevData.map(item => 
            item._id === property._id ? response.data : item
          )
        );
        alert('Property updated successfully!');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    console.log("New date selected:", newDate);
    setSelectedDate(newDate);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  const downloadCSV = () => {
    // Filter data by selected date
    const filteredForDownload = selectedDate 
      ? propertyData.filter(item => {
          const itemDate = item.data.date ? item.data.date.split('T')[0] : '';
          return itemDate === selectedDate;
        })
      : propertyData;

    if (filteredForDownload.length === 0) {
      alert("No data found for selected date");
      return;
    }

    // Prepare data for CSV format
    const csvData = filteredForDownload.map(item => ({
      Date: item.data.date ? item.data.date.split('T')[0] : '',
      Type: item.data.type || '',
      Price: item.data.price || '',
      BHK: item.data.bhk || '',
      Sqft: item.data.squr || '',
      'Premise Name': item.data.project_name || '',
      Address: item.data.address || '',
      Area: item.data.area || '',
      Description: item.data.description || '',
      'Sub Type': item.data.sub_type || '',
      'Owner Name': item.data.owner_name || '',
      Number: item.data.number || '',
      Furniture: item.data.furniture || '',
      Status: item.data.status || '',
      Remark: item.data.remark || '',
      extea: item.data.extea ||''
    }));

    // Convert to CSV format
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `property_data${selectedDate ? '_' + selectedDate : ''}.csv`);
  };

  const downloadXLSX = () => {
    // Filter data by selected date
    const filteredForDownload = selectedDate 
      ? propertyData.filter(item => {
          const itemDate = item.data.date ? item.data.date.split('T')[0] : '';
          return itemDate === selectedDate;
        })
      : propertyData;

    if (filteredForDownload.length === 0) {
      alert("No data found for selected date");
      return;
    }

    // Prepare data for XLSX format
    const xlsxData = filteredForDownload.map(item => ({
      Date: item.data.date ? item.data.date.split('T')[0] : '',
      Type: item.data.type || '',
      Price: item.data.price || '',
      BHK: item.data.bhk || '',
      Sqft: item.data.squr || '',
      'Premise Name': item.data.project_name || '',
      Address: item.data.address || '',
      Area: item.data.area || '',
      Description: item.data.description || '',
      'Sub Type': item.data.sub_type || '',
      'Owner Name': item.data.owner_name || '',
      Number: item.data.number || '',
      Furniture: item.data.furniture || '',
      Status: item.data.status || '',
      Remark: item.data.remark || '',
      extea: item.data.extea ||''

    }));

    const ws = XLSX.utils.json_to_sheet(xlsxData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Property Data");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `property_data${selectedDate ? '_' + selectedDate : ''}.xlsx`);
  };

  const clearAllFilters = () => {
    setSelectedDate("");
    setNumberFilter("");
    setPremiseNameFilter("");
    setBhkFilter("");
    setAreaFilter("");
    setStatusFilter("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Delete functionality methods
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    if (deleteMode) {
      setSelectedItems([]); // Clear selected items when exiting delete mode
    }
  };

  const handleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const confirmDelete = async () => {
    if (selectedItems.length === 0) {
      alert("Please select items to delete");
      return;
    }

    setIsLoading(true);
    try {
      // Delete each selected item individually
      const deletePromises = selectedItems.map(id => 
        axios.delete(`http://54.162.19.212:4000/data/property/${id}`)
      );
      
      await Promise.all(deletePromises);
      
      // Update frontend data
      const updatedData = propertyData.filter(item => !selectedItems.includes(item._id));
      setPropertyData(updatedData);
      setFilteredData(filteredData.filter(item => !selectedItems.includes(item._id)));
      
      // Show success popup
      setDeleteStatus({
        success: true,
        message: `Successfully deleted ${selectedItems.length} items`
      });
    } catch (error) {
      console.error("Error deleting items:", error);
      // Show error popup with more specific error message
      setDeleteStatus({
        success: false,
        message: error.response?.data?.message || "Failed to delete items. Please try again."
      });
    } finally {
      setIsLoading(false);
      setShowDeletePopup(true);
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Conform":
        return "#d4edda"; // Light green
      case "NA":
        return "#fff3cd"; // Light red
      case "Rent Out":
        return "#f8d7da"; // Light yellow
      case "Already Listed":
        return "#cce5ff"; // Light blue
      case "Broker":
        return "#f87171"; // Light gray
      default:
        return "white"; // Default color
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(propertyData.map(property => property._id)); // Select all
    }
    setSelectAll(!selectAll); // Toggle select all state
  };

  return (
    <div className="p-2 bg-purple-50 min-h-screen">
      {/* Loading popup */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-lg font-semibold">
              {selectedItems.length > 0 ? 'Deleting Properties...' : 'Loading Properties...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Delete confirmation popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className={`h-12 w-12 mb-4 flex items-center justify-center rounded-full ${deleteStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {deleteStatus.success ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <p className="text-lg font-semibold">{deleteStatus.message}</p>
            <button 
              onClick={closeDeletePopup}
              className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Fixed Header */}
      <div className="bg-purple-50 h-15 px-2 rounded">
        <header className="flex justify-between items-center">
          <div className="flex items-center">
            <img className="h-10 max-w-40" src="https://cdn-icons-png.flaticon.com/512/9111/9111412.png" alt="" />
            <span className="ml-2 text-xl font-bold">GFY AI</span>
          </div>
          
          <div className="flex items-center h-10 gap-4">
            <button
              onClick={toggleDeleteMode}
              className={`${deleteMode ? 'bg-red-500 hover:bg-red-700' : 'bg-red-400 hover:bg-red-600'} text-white font-bold py-2 px-4 rounded`}
            >
              {deleteMode ? 'Cancel Delete' : 'Delete'}
            </button>
            
            <Link to={`/sorcenewspaper`}>
              <nav className="flex justify-between items-center p-4">
                <button className="text-gray-700 text-2xl ml-auto">Home</button>
              </nav>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadCSV}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download CSV
              </button>
              <button
                onClick={downloadXLSX}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download XLSX
              </button>
            </div>
            
            <nav className="flex gap-3">
              <Link to={`/`}>
                <nav className="flex justify-between items-center p-4">
                  <button className="px-3 py-1 rounded-lg text-xl transition-transform duration-300 hover:scale-110">
                    Logout
                  </button>
                </nav>
              </Link>
            </nav>
          </div>
        </header>
      </div>

      {/* Company Info Section with Delete Confirmation Button */}
      <div className="sticky top-0 z-50 bg-purple-50 border-b border-gray-200 px-2 py-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-black font-bold text-lg">{companyname} - {categories}</h1>
            <p className="text-gray-600 text-lg">Showing {filteredData.length} properties</p>
          </div>
          
          {/* Delete confirmation button when items are selected */}
          {deleteMode && selectedItems.length > 0 && (
            <button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded absolute top-[-40px] left-1/2  transform -translate-x-1/2"
            >
              Confirm Delete ({selectedItems.length} items)
            </button>
          )}
          
          {showFilters && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">Date</label>
                <input
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e)}
                  className="border rounded p-1 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={numberFilter}
                  onChange={(e) => setNumberFilter(e.target.value)}
                  placeholder="Search number..."
                  className="border rounded p-1 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">Premise Name</label>
                <input
                  type="text"
                  value={premiseNameFilter}
                  onChange={(e) => setPremiseNameFilter(e.target.value)}
                  placeholder="Search premise..."
                  className="border rounded p-1 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">BHK</label>
                <input
                  type="text"
                  value={bhkFilter}
                  onChange={(e) => setBhkFilter(e.target.value)}
                  placeholder="Search BHK..."
                  className="border rounded p-1 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">Area</label>
                <input
                  type="text"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  placeholder="Search area..."
                  className="border rounded p-1 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold mb-1">Call Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded p-1 text-sm"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={toggleFilters} 
              className="text-black font-medium bg-purple-300 px-3 py-1 rounded-lg text-sm transition-transform duration-300 hover:scale-105">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showFilters && (
              <button 
                onClick={clearAllFilters} 
                className="font-medium text-black px-3 bg-gray-300 py-1 rounded-lg text-sm transition-transform duration-300 hover:scale-105">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="overflow-x-auto h-[calc(100vh-100px)] relative">
        <table className="min-w-full w-screen bg-white border-gray-200">
          <thead className="sticky top-0 bg-purple-300 z-10">
            <tr className="text-black text-sm">
              {deleteMode && (
                <th className="p-2 border">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span>Select All</span>
                  </div>
                </th>
              )}
              <th className="p-2 border">Source Date</th>
              <th className="p-2 border">Property Type</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">BHK</th>
              <th className="p-2 border">Sqft</th>
              <th className="p-2 border">Premise Name</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">area</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Sub Type</th>
              <th className="p-2 border">Owner Name</th>
              <th className="p-2 border">Number</th>
              <th className="p-2 border">Furniture</th>
              <th className="p-2 border bg-purple-300 sticky right-0">Call Status</th>
              <th className="p-2 border">remark</th>
              <th className="p-2 border">Extralist</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {filteredData.map((property) => (
              <tr key={property._id} className="text-center border text-[14px]">
                {deleteMode && (
                  <td className="border text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(property._id)}
                      onChange={() => handleItemSelection(property._id)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </td>
                )}
                
                <td className={`border ${isFieldMissing(property.data.date) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.date || ''}
                    onChange={(e) => handleFieldChange(property._id, 'date', e.target.value)}
                    className="w-24 min-h-[40px] text-center bg-transparent border-none outline-none font-normal"
                  />
                </td>

                <td className="border font-normal p-0">
                  <input 
                    className="w-21 min-h-[40px] text-center bg-transparent border-none outline-none font-normal"
                    value={property.data.type || ''}
                    onChange={(e) => handleFieldChange(property._id, 'type', e.target.value)}
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.price) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.price || ''}
                    onChange={(e) => handleFieldChange(property._id, 'price', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-normal"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.bhk) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.bhk || ''}
                    onChange={(e) => handleFieldChange(property._id, 'bhk', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-normal"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.squr) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.squr || ''}
                    onChange={(e) => handleFieldChange(property._id, 'squr', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-normal"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.project_name) ? '' : ''}`}>
                  <textarea
                    value={property.data.project_name || ''}
                    onChange={(e) => handleFieldChange(property._id, 'project_name', e.target.value)}
                    className="w- min-h-[40px] text-start bg-transparent border-none outline-none resize-none pr-2 pl-2 font-normal"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.address) ? '' : ''}`}>
                  <textarea
                    value={property.data.address || ''}
                    onChange={(e) => handleFieldChange(property._id, 'address', e.target.value)}
                    className="w-72 min-h-[40px] pl-2 pr-2 bg-transparent border-none outline-none text-start font-normal resize-none"
                    rows="2"
                    style={{ whiteSpace: 'pre-line' }}
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.area) ? '' : ''}`}>
                  <textarea
                    value={property.data.area || ''}
                    onChange={(e) => handleFieldChange(property._id, 'area', e.target.value)}
                    className="w-40 min-h-[40px] bg-transparent border-none outline-none pl-2 pr-2 text-start font-normal resize-none"
                    rows="2"
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.description) ? '' : ''}`}>
                  <textarea
                    value={property.data.description || ''}
                    onChange={(e) => handleFieldChange(property._id, 'description', e.target.value)}
                    className="w-72 min-h-[40px] bg-transparent border-none pl-2 pr-2 outline-none text-start font-normal resize-none"
                    rows="2"
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className="border p-0">
                  <input 
                    className="w-48 pl-2 min-h-[40px] text-start bg-transparent border-none outline-none font-normal resize-none"
                    value={property.data.sub_type || '-'}
                    onChange={(e) => handleFieldChange(property._id, 'sub_type', e.target.value)}
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.owner_name) ? '' : ''}`}>
                  <textarea
                    value={property.data.owner_name || ''}
                    onChange={(e) => handleFieldChange(property._id, 'owner_name', e.target.value)}
                    className="w-auto pl-2 pr-2 min-h-[40px] bg-transparent border-none outline-none text-start font-normal resize-none"
                    rows="2"
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.number) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.number || ''}
                    onChange={(e) => handleFieldChange(property._id, 'number', e.target.value)}
                    className="w-48 pl-2 min-h-[40px] text-start bg-transparent border-none outline-none font-normal resize-none"
                  />
                </td>

                <td className="border p-0">
                  <input 
                    className="font-normal min-h-[40px] w-auto pl-2 pr-2"
                    value={property.data.furniture || '-'}
                    onChange={(e) => handleFieldChange(property._id, 'furniture', e.target.value)}
                  />
                </td>

                  <td className="border sticky right-0 p-0">
                    <select 
                      className="font-normal min-h-[40px] w-auto pl-2 pr-2"
                      value={property.data.status || '-'}
                      onChange={(e) => {
                        handleFieldChange(property._id, 'status', e.target.value);
                        setStatusColor(getStatusColor(e.target.value)); // Update status color on change
                      }}
                      style={{ backgroundColor: getStatusColor(property.data.status) }} // Set background color based on status
                    >
                      <option className="font-normal" value="">Select Status</option>
                      {statusOptions.map((option) => (
                        <option 
                          key={option} 
                          className="font-normal" 
                          value={option} 
                          style={{ backgroundColor: getStatusColor(option) }} // Set option background color
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className={`border p-0 ${isFieldMissing(property.data.remark) ? '' : ''}`}>
                    <textarea
                      value={property.data.remark || ''}
                      onChange={(e) => handleFieldChange(property._id, 'remark', e.target.value)}
                      className="w-auto pl-2 pr-2 min-h-[40px] bg-transparent border-none outline-none text-start font-normal resize-none"
                      rows="2"
                      onInput={(e) => {
                        e.target.style.height = "40px"; // Reset height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                      }}
                    />
                  </td>
                  <td className={`border p-0 ${isFieldMissing(property.data.extea) ? '' : ''}`}>  
                    <textarea
                      value={property.data.extea || ''}
                      onChange={(e) => handleFieldChange(property._id, 'extea', e.target.value)}
                      className="w-auto pl-2 pr-2 min-h-[40px] bg-transparent border-none outline-none text-start font-normal resize-none"
                      rows="2"
                      onInput={(e) => {
                        e.target.style.height = "40px"; // Reset height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
  );
}