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
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // console.log("URLSearchParams:", params.toString());
    const companyname = params.get("campanyname");
    const categories = params.get("subCom");
    // console.log("URL:", window.location.href);
    // console.log("Company Name:", companyname);
    // console.log("Categories:", categories);

    if (companyname && categories) {
      setCompanyname(companyname);
      setCategories(categories);


      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/data/companydata/${encodeURIComponent(companyname)}/${encodeURIComponent(categories)}`);
          console.log("Response Status:", response.status);
          console.log("Response Data:", response.data);
          if (response.status === 200) {
            setPropertyData(response.data);
            setFilteredData(response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } else {
      console.log("Query parameters missing.");
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log("Selected Date:", selectedDate);
      // Convert the selected date to match the backend format (YYYY-MM-DD)
      const filtered = propertyData.filter(item => {
        const itemDate = item.data.date ? item.data.date.split('T')[0] : '';
        return itemDate === selectedDate;
      });
      console.log("Filtered Data:", filtered);
      setFilteredData(filtered);
    } else {
      setFilteredData(propertyData);
    }
  }, [selectedDate, propertyData]);

  const handleFieldChange = (id, key, value) => {
    setPropertyData((prevProperties) =>
      prevProperties.map((property) =>
        property._id === id ? { ...property, data: { ...property.data, [key]: value } } : property
      )
    );
  };

  const isFieldMissing = (field) => {
    return !field || field.trim() === "";
  };

  const subTypeOptions = ["Apartment", "Bungalow","Office" ,"Showroom" ,"Penthouse" ,"Tenement","Shop" ,"Godown","Space","Shed","Weekend Home" ,"Rowhouse" ,"Residential Plot" ,"PG","Pre Leased Spaces","Basement","Commercial Plot","Co Working Space","Factory","Commercial Building","Industrial Land","Commercial Flat","Ware House","-"];
  const furnitureOptions = ["Furniture", "Unfurniture" ,"Semi-Furniture","Kitchen - Fix","-" ];
  const statusOptions = ["Conform", "NA","Rent Out","Already Listed","NI", "WTSP","NW"];

  const typeOptions = ["Rent", "Sell", "Both",'-']; // Example options

  const handleEdit = async (property) => {
    try {
      const response = await axios.put(`http://localhost:4000/data/property/${property._id}`, {
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
      Remark: item.data.remark || ''
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
      Remark: item.data.remark || ''
    }));

    const ws = XLSX.utils.json_to_sheet(xlsxData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Property Data");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `property_data${selectedDate ? '_' + selectedDate : ''}.xlsx`);
  };

  return (
    <div className="p-4 bg-purple-50  min-h-screen">
      <header className="flex justify-between items-center pb-3">
       <img className="h-auto max-w-40" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAABVCAYAAAC/4RZ1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAACFmSURBVHhe7Z1tsFXVeceTzjSZCvgyAYrEVG5VNIEZvJiRNK3ANeqMAQeunSmSmniFRJrMgEAmjfkARPlQLSlgnElKDC9WU/SL4Ah0WiOvnWkhieAMSCLqvSZKrJDxBbGp/ZCe387at/tu9st63Wfvc5/fzB3OPvdyzt5rr/X8n+dZz1r7w7/73e8+JAiCIAhCs/kD9a8gCIIgCA1GBF0QBEEQOgARdEEQBEHoAGQOXRAC8PTWw0vPvvc/F6pDLSZPvWTv5Gsu2asOhWHO7h0v9L3563cnqEMtxl58/sD1sz+1RR0KwwwRdEEIwKI5W/rffMPMGM/78rX33vaVz3xbHQrDnBVffXLP0edem6kOtZg89eN7V3//L3vUoTDMKBT0oz97baaph+gLPM0Roz76dvyvejsIeMLqZaVwXSNGtq5x/PkDXKd6W+gARNAFV0TQBVMKBf279/3blj07f36HOmwbY8edP9A1ccyRSVPH75s247LtCKD6lRd6p3237WkKhJ1r7LpyzJFrr+t6SlKvzUYEXXBFBF0wpRFFcRjGg/tfnrtp/YF1i3q39C//4tbD0fzSyfZkD0LAfCuDl7nXFV97cg+C8NDqZzZ30jUKgiAI4WhklXv/i6eufmj1jzfjwT7xw0OrOlH0cGJ27zjehwMjwi4IgiCU0ehla4je4w//57cR9nbNg1dBLOw4L+otQRAEQRhCR6xDR9iJ2Ilkz54xWyrUJHBeorlZidYFQRCEFB21sQyR7PLbtx7uZMHDeVn+pa2HWYGg3hIEQRCEzhJ0QPBIwXeyqJOFoHBuz87jbV+BIAiCINSDRixbs4Glbqu/f2uPzhK3Oixbs4F17Ku/d2sPy93UW7UAh4OKfZyqgZdOTzn77gcX4midfXfodAj3JlqH//HzB8b88chXuY5OWa4ny9YEV2TZmmBKxwo6sJUmoq4Oc2mqoAOOy9rH5neH3nynDKYADh3on3Nwz8tzTYUsDfetZ9ZVj/Cv7z0HqkIEXXBFBF0wpeNS7kkYDBSSqcOOBNFoV/U7kTjfffvnNrzFFABr6F3FHLhvFDlS2Y9R6+QVDIIgCL7oaEEHBId16+qwI3n68cNLqyySI5XOioLbb9jwFg6T6UNITBgU91bEK8IuCIKQT5CU++IVN9xp88QfhAGx4Ied4Y797OQMHxFfWerdNuW+7eCSD6uXRrA/PteIo3HsuddnHNz/ylz1K2t0pxdciCNyHAj1VuUwxTDvK9feW/cnSknKXXBFUu6CKbWK0OP9zKfNvGz7kpU39W14qq8L5wAjrv7ECgZFnZZ58SAWir9umd+9/p41s3s3bO/rYs5Y/dqK0Ne44/Hn7140d0t/O8UcEMk4YscpUm8LgiAMe2qfcicSW/2Pt/ZMm37ZdvWWFXXeZQ2Bx4EhQlNvWXFw38vOkX4aovL7v7Fz28Z1+9aHTK2bgrAzx95uB0MQBKEuNGIOHcG7Z82s3p7Pf9I6iu0/cepqxEkd1hLSrS6ivmeX3xUJRMBs1MP0h3qrdmxad2AdP+pQEARh2NKooriFy6cvtV1zjZiHiGB9g6jbZiO4Rl9pdz6Hp9r5qGEIDVF6dK6BU/BxH+Kpf8xvqrcFQRBqQaMEnbXWC5Zet0wdGtOUavfFK2+4k3oCdWgEmQj10hoKIVmG5ppi5xqmTf/T7bPnTXmQ+0Y9RPKHbAS/o5BH/RdruLeIrE9Rp3iRpXhU9DNnT1X//X+7cxvvmRYrCYIghKZRgg4Uk1HRrQ6NoGpevaw1OC6TP20ncgMnTk9RL61AzFndoA6NQZwRagr9Hnt20UUU/S1cPmMpBYDUQyR/yEbwO6pyWTHArncUB9oWQZJNsBX1OLsRPY++9RmsracIkGicZwQ0IVMhCMLwpnGCDkR16qURb/5Xc4zytdf96VPqpRHvvfvbi9RLY/p/cerqjWv3rVeHRhCJI8iIM0JN3YP6lTY4a66rGxDe+7+5c1tZvQTRN+vaEWzS9UTfZCU4JvquUwGgIAiCDo0UdNv9vjHyp944c6k6rDW2tQLvv/fBBeqlEUS1pJNNhYyIfO2j87uJxH3uw04EbyvspN83rd0/WCiXjL6p2I+jb5a/8Z7tVExT+pIgCMODRgo6KWnXtel1p+q92aNUtUFamfnxBcuuW0ZEbut86ICws2zRNCuze9fxvnhJG4K9e+cLfaylp2Jfom9BEDqRWu0UZwJpUpvIirRwOpKseqc4HUgJE0WqQ21sdopijb7JnvcI+D1/P6vXJq3uAgL9xMOHVpkIMtmDpMNBnyFaP7T/lTlHn3vdqbDtB0/dOWHMuFGvqsMhhNopjvPnZ+Cl30w5e+a3F7558syQ7xg7ftQA58Q1d10x5khTHm5Df+e+ZF1X/ES+CZd/7PnougI4kFnfn6zFGHH+R9/mPOJzmdQ9fh/9P8S5xOBkD9ed4uL7wb9kworux4SJql80pL9HGcPWfeV64qdRJm0aY3jC5aOjazLNejZW0G06OzRF0DHaOC3qUBvTAU2nYoMWdVgKc+WLV91oXYXvCgN8xd/oZxMYFIi6OhwCg+joT1+babvNcFWCHjkgB/rn7H76hT7T7EJsFGb/1ZQHfRk7ag9s7EJ6a2IM244nnr+b6zMZy2Tn2P7X9Wl8cbu6PCGQc6GAlT0yfE45QTsFnfvr8uwEHH7TLCP349jhkzPo57b3w3d/xw7b7HNB9pJzUYcRXB/Bk2lfp3/NWzjtXp3rEUFvUUdBP7j35bkUd6lDba6d3vXUt9bcor3e3kR4ej5/1SNLVt3U9gekmIo6g+uW27pLi/3i6J1BpyOcoQXdxgAUgQDyHa7CQzbHZufF5Hhh+sP1wT6xsJvYGpyIyCHZ9fM7uN/qbS/4cjRi2iXoOPkEE7b3Rne8xfju5zE++jvnRrGsOtQmqTN8xkP3/XizrZMSg23getRhJo2cQwfbwVj13LQthw68Mke9NCLtFRaBYdPtZHxuHcQc4p0DdbMEkUC3DLk6zCXy7ltGwEVkfIBBxZhjSHwaOT6Lz2RdfTJ9WSXcB67Nx1bC9F0KG7kenftLf2fnQ1Yy+BZziM+H63OJbttJ3Pds7w2CoyvmkVgG6OcxdejvRPecg6uYAw5wFCgUXEsjBZ0Lsu1wVc/72sD1Hf2p3fwu80jqZSnMR6uXhRB5kEJTh7UA8SUTpA4Lwdjr7PnO31Hprw7bAkaO6CiEgYthXX07RId+jaD6vrboelpGM0/U+V6uF7H1YVjLiIW9zPjWEZc2YjqurAYEuE+x0IXs5zH0j+Vf2nq46uc+PHTvM5t9fyf3hr6c168aKei2nYDovAkROulA20HVdaWeoJtE51SZ19ER4ql8utXvzNWWRXGb1u9fZ9LuLmv+szi0v39OJEwVZAi4Tox3lfvgR4bIsl+XQcSdtbUzqf3QDlIeXCv1KTbTE+3AJe2N009tjTrMJXJYW05d1eIaOxG62RxXog2pdh0P4jDTr1i1ow6H0EhBt5nXh64rRgerSPUFRsmk4jxJ1+VjjugKr250TgqtDmKOR4ooq8NBiAgwJuowFwZxkRHBwcGTV4da+DYMIdLAZdAmrM2vwsiFEnOgn6bn0jHgdXhKIOO5qja2hf5va3cYfzj9ZVNgOFe+0s+2xNmc0JmTkGOZOom8TEjjBJ2OZ+tFTrhi9PPqZS3BUaF4Qh0aM3u+XrSKl6wzqBioOim0KiCaZBe7dERJxmXtY/O7dR5oc2hvf2ZdAoO7zMFpV1V/FVDl3+6pBhfI0iT7KcJJNqDqKLAI2rgKIbGBc3LJ1FDPUub0E/3jXKnDtoLY6uwmWUei6c81s3OnPxsl6DqGt4hpM9yeqR4KOhipIFYVuEQTutWce3Yd18pwULGrXraVZCoQI00KNWkYEXWMSlkFaP9Lv69iV4eDPLHx4KoiB+f62Z/cQuWuOuxIaN8q0+++IFrheQDqMALnpB0p9jLqKCSMI5wfW7uTtTwrDePXNvoPRXQvGubE6mRCGiPoccezTdfQGK7LddIgDrY/ZBqYZ+GaECjTdG8aREc3Na5TcEd7hV56qAP7y6eNAYMx6gsJUQeitDJRT9dQkAYsanvaYd6Xp0XpXCrg1dsdCc5SnaLaMrKiFZySOop5TN2EhPaytak6Fe3x8kR1WCua5MQi4jq1TI0QdATQRczB9ullRZBCs/0hhezrMZyx6KjDQmhLnXbUTd+HBMHOM35cA5Wr6UIoRJ01oLSJemsQDFAymuDzy4wNj7KNB1GZs9AJEE2lHaU6wv1NRyucexMckroICe3FVIA6NKJoHjdGZ3y1G/oLNlEd1pakHSqi1oIeCzkC6CLmoCt4TYTUuG50ToSgXhYSYnrinTPvX8iPOiylLBVO6hLBxzCptyLIxETebELUeZ02QPStolRj9Kz2RFaH150epdOmOJvqsJZkRStNEI8k7RYS1yK4xSvLK9rLxpcuOA+MxQVLr1vGUlV+eB2Nz9bv1J9Z41K3VAVMa+ja4yA7xSGeNg3NDmAYFPa3JS3sKuIxpKMXr8jvgLY7xdUBOnV6DrEI5vDYhU4dZsK9870f9Hd+uH3Vdx7eHhmQu267af19y75QOCdNqs6kiIbUX3qem/7EYCUi4vnsSQEom9fDaPG0N3U4CJ8Z77F/zwOzelk6F/0ihc1OcTogZuz1nIxMMZr9L572WlVbtNsj7ZZ2olzgWuhzYy4e9Wo8JTLw4ukptF/WdWXt9hiivceOa7Wz2jMch+HNN4bum+8KfYyCzryltAiiaQZPZ+xyLbY7wdEWnHNZAFE2vsrge2bfNuXBW+Z3r0/29SwYkzgo2AxbB4LsW1bGIQoqWwGlOnSGa+maOPoIBdrxfY8070RL8zKeLZF3XnkEEfQ6odMBmyropI/ZH7uswyfRMXxFTgLGAKcAMdPd3vJf9v5s7p3ffGhI6nzzA4t7b555TaYY2hoc2iPrvBiUSQHg88v2r087AEliQSsSPZ8Cw/3tmXXVI3jpaSGLoa1w1PbsPH6H60NnIM+hAV+CjvhEzn/ONQHGmu+L7VDWtqIYcx9ZhWQ7s59D1riiLzHNc2hf/xwf97fIYIcQdMSDdeC2584GU2XRos74KgL7c9tdn/m2iV2DpAOv3tIGcd2wra8r7Vz5EnSupcxBiR2TeGyZBmvQuGVrppiko5uEjZgzmHUGct6AZaBiZOKitKyNPLL41a9Pn/OdR0/8Mjei5LNtPO28YrmkYNAG/I06zAQjW9RnEBRTY2MLgxphZWAXCR/ng3OBMedhNAiy+pUV9BOMizr0Dm3MuRZdE3Aflqy8qQ8h5/9kFWG5rHwB2o7PTrZz3v3ld/wNf8s5ubazzoZHPnHZU5w20kn9MlWmXhpBm5N9oX1txhd9BZvIg3LUW9pwD0LVX7CDHv0Fx63oujh//oZggv9jKubQ0YKOMSyrwmwiPCTFVMwBD1C9LCRZOJYkWRHLv1nz11lMnnjpOZ9384zs6JzPszU4wP/NKpaLKft8rr0sxYUXj7etDoPgYty4BgwIBli9ZUWo7BznVdbGaRjHWf8Hp8Olv8Rp7zJjmwXnxFx+3njRIaSQpKHv2xbBRVGzxj3DmbZdsYNNK3PwdFiy6sY+m1qXvH0qXMBWsxLDpG8h7EVrzYvoWEFnkNl4OHWGTkFUwENSTI0P6EYCWXN6ecaAdGhWVJzks9dctXfzA0t6J038xJE/m3rlXubPJ0/8k3OMIMa5bN4NMSi7dq4zy9ng84uMJ5+ru2c9xq0oineB8/Bh3DhHF1Endem7cIt6Fh1h0MUlOo/E/Efl88FFRFFhy/FyEfUqonQc3LKxlYeJLbVJdwN2zaUN01AVrl5qk7dPhS30r4Vfr1aDOlLQ6RgYRHXYETA3RiThknHQidCzUohlxoBBjKgXVdDfPHPq9mcfXd297fvf6qEoTr09CA5BmXGOI7uoJkIj1ck5x8uDdD4/SqEaGHcf0UQWPo0b7eVSmW9roPPwudoE42sbndN/0svebMEBzlsqqQNirrv6xAb6/qa1dsvkuCaTBzNlbc9cBt/hO5PKOKYeQh1q47O/M93ro3+Z0HGCbpuOriNcAxENxoL5xlARYZL0+nNdYxClur+49XA6KtaFoqYi44xDE0d2UVSUWpaWBxE551W2gQbtXIeNdEKcB9GK7Xg49tzJGeqlMzyr32cf1q3hyMJ3bQ2izm6F6tAY3d0bTcFZiDJoFo4PfSa9PLAIbIWNY2ITTetw/SzzceSrv2Ob2mFPOkbQ6Xwu6ei6wLlTEEEFNfOgLLcLFQmmyao5MDUGRMU8iILBrd4qBSegyDNmcKTXvWJkiNQ5Z/VWLhiZorlDPr8u+xSEOA/aynbOn/viKx2sU1BlwrHDdsY3lPNGVsUmKoSD+16xdk6KMH2CYBLdzUxibKJbxl4o+8bnmma6fPX3EBuZ6dARgu4jHW0D38uPTqRYxKemjt/HciuqGx97dtFFFERgcKp0TLiG9DxZWVSbR/QgipJ59Rj+pnTePCeaIirinF2Lv+qyEsJ3BJvEZWz4Sgf7nCN1SVPbVEHrYtvOXM+pN85cqg69gKNsW6DGmDJ1wI4dft3YwUL4mDoJ9WNjm3WLh4to14PAGr0OHTEtW8eqg+069G0Hl3yYfxmMLms74zk4nwYvC4rCstbr0unTqTXTjV3yIGuSZ+R02i2eN1eHEb/89akJF4wc8fYFo84bdHhIrTNHbrrcjQg/RPGkzTr0onXtPsDJsomi0vcQB8xmaiUeLz7AWNusD6avk/lSh0Gwbef0RkU2n4NNZHrOtn3AdkzYXnfdSN4H23bEnleVWU3SuAidqBUjH88rt6PR0rjOnyFsVTwvOS/6W7B8aDEYUXOZmGM41MtCiPJ5klzWtZWlAzG+STH/1cnTE3q/+nd7rp37jf4rb/jaW+w+p34VRUa6xXIx0eff5a/i2pXQfZkMgHpphMn0SVXYjpUqUqETrviYVXRmGxCk4X7ZbmfqMiZCFvZVie1uc3Wg1oKOeLNNHnNe7N3LhhmkpKPK3RoIeRKiayIZdWgMgzn0U5iydnZLp9YwBnja6jATrhVniuvVmRYg7RdF4glhKHvKGZ9L1kAdRvzg8X9d+h/P/WIwAmAr2dfe+M1gmhKnRLdYDvjbKqc1isApDJVuj7EdM++f/eAC9bI29J+wE48qUqG2qwp8OE5n3/3AugiOceMyJposhEl8pNzbRRBBx9AzH+zyQ3oO8V776Be6KQxjy7zQKWlXiBJd5udIV9lWieuQFgyK79Lp7LJqcwZ9vIzFJCrmM9nwhdQ4hstm3vyd9859sMsvXz81JH3K/9EplsORCS2gJnRdMTp438ZpUC+N8CE0dUHX2XNBd0vkND4cJ9ZS20b6ZBltx0STRbCTCCLoeHh0DJcf9VGNY+Hy6UtdjAZCx37c6tA78bnx74Ll04dkFMqqzSFd+cprBFSnupc0KSn4sn3aychkzbv/+dRPDol8Lhn3sYFJGRvUlBXLce1pR2Y4UJdsRDuxdWpMqOI7QiCi3Hw6osq9TjCY8XRdjOfGdfvXh4qKJl0zfh/nli6C092lLSttyzXH+22rtwopEnPENm/p1rzZf7HlwRVfvpPd5m6ePnX7ljV39yYL49Ig2ulziq9dHQ4rmio0gj4udifKznVQNsaWJo8TEfQAMDVAylgdGkMkyzxYiCI55vfS6WwGMZGzOswkKz2fhqia6RKXDEVZ2g9RZ7e5zWuW9Ka3j920/sC69Nau0bTAo/8/LVCXJWppmPtUL4MhEdjvx5Z6GYwqviMPao5s5/BD2p0m4WK/2o0IeiAQEp1NT/JgHizEg/dZFpVMZw8O4pKoOZmef+fM+xdSYX736h9ufnzHgSGFbYglEfC06eabiJABcKmTOLjn5bk4Juk6hKiIr3VOfH5WKr8OVFFQZBt9nTfyI++ol7XBNhKtop1tBfG8EX7amRoXW1HC7mxau994m1iXzEDdkAhdyISI1kmg9r88N2SRHOjsJJVOz69c/8/rqDB/Yse/9y1dvXHzmoe3DYnc+Vsi7bw57CxoJ5d57eRTt5g6QNiThpVzqvO8OeceOjKyjdDrmNGwNbpVLK2y/Q7bYro0tI3Ldqq7dx0vfIhRFnxnp4i6i81uNyLoAaGT4y27dHTEic0N1KFXcBbKdpJClNMGHSFXLyNax5lFfAiozrO5+b3JAyCySD94JdrDPbVUru6EFhubnbzAl9D4xNboHtrn/xGZaQ7tt/sOn6leal1cltHiEJvaHZt+gm0cO27UQF1+2F+jyRF6kJ3iQu945RvXneLKyNuhTRc62Np/agmjR8OqswMS1eYsGVSHg0z83Fffeve9/x6MJidf/okjP/7R6m51eA5Ehkwf5FXQu/YXHJO8gj6MJA/rqVqUbHaKC7VrXYzNOUF6BzPa2iZz5HOnOLIZt9+w4S11aETIXbxwIBf1bulXh0bg/CYdFabCbHeKU4dOu7eZ2h0bvQjd512RneKEc0CsXObTB+e5PaVkMTpl8/MI4YJlQ5e1xaxe9teD758/8o/e/vpdvYWpdSJ8RDUrBU+7uIg511JUnY+Axevf1Vu1Zc+un98RKu2enJIwpevK+qUgERvbKN3lKW1lcA/VSyMYbyFSvS7z6fTF+7+pv4Nl1xXm52/bXkI2IugVgRfqMmAxxjbFKlngsRcZd9JgzJvnTRVQaf6T7d/pevJ79/T85Kl/6Lp5xlStAjhS8ER7sYHhX1fvHEdHvcwFg7Rjq/lzmquG8wzleJQ9Cz4P7lEd59BhUvf4feqlETyzO8RUDJ+5++kXrB6GEmpLWhwfl/l0poF0szE2ESl9PtSU4nBEBL1CXOfTbYpVsig7h6xlben53U9cPHrgs9dctfeCkfnrwLMgdRsV2bWEgn/V21ZgaHSjTpdlhFUSQmxM2ilNux4DqYPL41hdpsDyeGLjQet2ntT9cSvnRAfX+XRsjo7dIWCxsW9kC3WzAEIxIugVgki6Fn/ZFKukKfKkSYFnLWszfcZ5EbQDT7xyifyK5s3T4Dw0paaD9jZJc5ZBX9FtpyxCPmrUFfqxrYNMlqps7wUT6I+2jyqton8ypm3XpwNtpVO0afPcfZwg3SyADYylEBmZOiKCXjEYIZPlXFlg8F06KGm4rMGdlQKPl7Xxg7DXYWCYiDm4PAmvHWA4eVCPa1sj5i4P/KE/2KRRq8RGQGKIOn0IiWl/TFNVFsRlPh10nHrbrAn3IsSW11FA8rUn99TFdoVGBL0NMJfs4i37iOLSe68z0NMp8HTUUQdRNzWeVOqHKDYKDREkbX1wr10BF+2EIXPZSGX2fHuxrAoiT5dpLPpSVP1v0af5P9wjFzGHvK2OfeM6n874L5uqYKzZ2rbv3vfMFh8OVgz3h6WrOMh1CkhCIoLeJqKHnDh4yybFKlmQ4kt+f3revP8Xp67OMlQMDJbl+JjLNwHn5aF7n9lsYjy5vqqMZQhoaxw3IiOdaRba6Omth5ciUK4iQ9u5zFFXBSLlEqVD3Kd5br9OO/M3bDPMQ4Zsl4TF4HC6TD2Z4jqfrjNV4ZKBpN9yH1yFF9vI/eHeqrdqEZCERtahtwi9Dj0PDIPNGsckDE7b7Uzj9fEMwOQuanHkkRwMWWCM5i2cdm/oNd60E4UzZeeTJr2ut0ps13wXQSTK9bCM7LwRf/gOQsAa//fP/u8FOGA4eb62Nk33iSQYXRtn0uc69CQ4MtEmQp7aO27nseNHDYwZN+pV3jv1xplL2W8fQfPVxnFWLE/QGYOmDkN6HXoeNp+dZMnKG/t6ZuXXV2xcu289BZ7q0BjahqkIE/tCP+A7WWlQ1Beidtfcm8LWRrdrHboIeot2CToQ6boW57h0Hoxz2nATEbLtrDoshMFx/S2/X2dPtKTe9gKOBQ6HjeFxcXR8EELQq4J7StGiOjyHugk6+HCOq6bMToYUdFcniLFetOmMTycrcmInjj4y4fLRz/O9OEA4VXwHPwMvnZ7S/+LpyKFV/6UUXVFvmqBLyr3NIDo2DzJJEkWvlmmktJjjYOiKOTBgMfAMXh+pMogGUcuYkQa1EXOiy3aKedNpyhK/JBhPl82bqobsVjuDHtf5dISUMcq/6q0huH5+EoSaWh6mOXDwEViKPXnNe/zORMwBu8X5d1r6XQS9BrjOp9M5mWtVh04wb2pzLpwDAwsRZqAwl4sw5w34JPwNu3cxOG//3Ia3GLC26cCiVLFQjuvOfe2EFRouxaZVwfjK24WxSlzn0xnzRTtO8vku8+mh6URRF0GvAXizLK1yqdbFQ/WxrpZ0Vrzxi3rLGMQYcUaY2W+b9DMDh1Q+UTw/vKZoBQHnb/C4cQJc5idFzN3gnt92V7Pbj6VZ7aqb0IE2Zny5jHWfkMlycYLKngjJeKxz5iRySkoq95uECHpNwAi5pjpJl/uoPo9F3ZdhZNAg8gx+onh+eF1VEZdQTt2ExpbIOXZcbx2KuI3ziuDahWt7MeVGNk4dngOZk7puUMR1+5oaqAMi6DUCb9m14+Mtm84nZYHRoUq87vOSCBDFRSLm9tRVaGyJ+u5j7VvhkEWd29jHfHfZZldLVt3YV7f0e6f1exBBrxkLl09f6uItMx+ts6OTLnjXCKbLOYWCil4Md1PnfNO0o40RvU4zaoBI1cUhjfrpj+Z317mNXefTI7tTstkVTrfLd/ikU/u9CHrNwBDR0VxSn77nhRBMzim9u1y7oG0wDCzP6aQB2TP7qkeqjGIQu2jpTocZtSTtdEiT/bQJUxmuK26iOp6SJ0LyHRu293W1M0Cg3+PsdWK/F0GvIXQ0V082Kkzz+PAJzmnJypv62h2ts9yHqLxTl6URxUTGJmAb89nMmyJ2TRAaV9rhkMbZo6b1U9cVNzpPhMSWsM9B1bYkWqP/vVt76PfqrY5DBL2mYIRc04UMLN8PPOC84sHIAFFvBwXRoS3w7BevuPHOTo4ogXQgbUy07tPg0Y58JunfJmzr6pPYIaUPhRT2WDSamj2KV9yoQysIJIqK5GJiRyu0sCfvSTs2e6kSEfQaQ7TmWtizcd3+9T6K5NJEg7E1QIgmMZAhBiQDccHS65YhbnjVnS7kabj/Pgxesh35zOEQleeRFHZfTim7mOEoPfbsoos6QTSwOa4ZQt3NrrgfcZBwzwOzen3ZEu5rJ90TXQq3fhUEE/DKSfUfe+71GWzFaLokbey4UQOTP33JXrZ4nDbzsu3DTcDLwDGjjWlf6iTePHlmQrqNaUMM8piLR73Kv7TjcBZwHWjDoz99bWb/iVNXD7x4ekpe29KOI0Z+JNrnXdo3LHFf51kFAyda96TlHJx974ML5Z4UI4IuBINBSdUrg5If3ourYEntRYOx9S+DkD2VxTAKgiDYI4IuCIIgCB2AzKELgiAIQgcggi4IgiAIHYAIuiAIgiA0ng996P8AiNp+23sJMpMAAAAASUVORK5CYII=" alt="" />
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            />
            {selectedDate && (
              <button
                onClick={clearDateFilter}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Clear Filter
              </button>
            )}
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
            <Link to={`/sorcenewspaper`}>
              <nav className="flex justify-between items-center p-4">
                <button className="text-gray-700 text-2xl ml-auto">Home</button>
              </nav>
            </Link>
            <Link to={`/`}>
              <nav className="flex justify-between items-center p-4">
                <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xl transition-transform duration-300 hover:scale-110">
                  Logout
                </button>
              </nav>
            </Link>
          </nav>
        </div>
      </header>

      <p className="text-gray-600 m-3 font-bold text-2xl text-center p-3 w-1/3 mx-auto rounded-lg">
        {filteredData.length} Properties found {selectedDate && `for date: ${selectedDate}`}
      </p>

      <div className="overflow-x-auto h-screen relative"> {/* Adjust height as needed */}
        <table className="min-w-full w-screen h-36 bg-white border-gray-200">
          <thead className="sticky top-0 bg-purple-300 z-10">
            <tr className="text-gray-700 text-sm">
              <th className="p-2 border ">Date</th>
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
              <th className="p-2 border">Call Status</th>
              <th className="p-2 border">remark</th>
              <th className="p-2 border bg-yellow-400 sticky right-0">Actions</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {filteredData.map((property) => (
              <tr key={property._id} className="text-center border text-xs">
                  <td className={` border ${isFieldMissing(property.data.date) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.date || ''}
                    onChange={(e) => handleFieldChange(property._id, 'date', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-medium"
                  />
                </td>

                <td className="border font-medium p-0">
                  <select 
                    className="text-start min-h-[40px] w-full"
                    value={property.data.type || ''}
                    onChange={(e) => handleFieldChange(property._id, 'type', e.target.value)}
                  >
                    <option className="bg-[#331818] text-white" value="">Select Type</option>
                    {typeOptions.map((option) => (
                      <option className="bg-[#A29276]" key={option} value={option}>{option}</option>
                    ))}
                  </select> 
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.price) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.price || ''}
                    onChange={(e) => handleFieldChange(property._id, 'price', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-medium"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.bhk) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.bhk || ''}
                    onChange={(e) => handleFieldChange(property._id, 'bhk', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-medium"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.squr) ? '' : ''}`}>
                  <input
                    type="text"
                    value={property.data.squr || ''}
                    onChange={(e) => handleFieldChange(property._id, 'squr', e.target.value)}
                    className="w-20 min-h-[40px] text-center bg-transparent border-none outline-none font-medium"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.project_name) ? '' : ''}`}>
                  <textarea
                    value={property.data.project_name || ''}
                    onChange={(e) => handleFieldChange(property._id, 'project_name', e.target.value)}
                    className="w- min-h-[40px] text-start bg-transparent border-none outline-none resize-none pr-2 pl-2 font-medium"
                  />
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.address) ? '' : ''}`}>
                  <textarea
                    value={property.data.address || ''}
                    onChange={(e) => handleFieldChange(property._id, 'address', e.target.value)}
                    className="w-40 min-h-[40px] pl-2 pr-2 bg-transparent border-none outline-none text-start font-medium resize-none"
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
                    className="w-40 min-h-[40px] bg-transparent border-none outline-none pl-2 pr-2 text-start font-medium resize-none"
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
                    className="w-40 min-h-[40px] bg-transparent border-none pl-2 pr-2 outline-none text-start font-medium resize-none"
                    rows="2"
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className="border p-0">
                  <select 
                    className="font-medium min-h-[40px] pl-1   pr-2 w-36"
                    value={property.data.sub_type || '-'}
                    onChange={(e) => handleFieldChange(property._id, 'sub_type', e.target.value)}
                  >
                    <option className="bg-[#102542] font-medium text-white" value="">Select Sub Type</option>
                    {subTypeOptions.map((option) => (
                      <option className="bg-[#c9cd7b] font-medium" key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.owner_name) ? '' : ''}`}>
                  <textarea
                    value={property.data.owner_name || ''}
                    onChange={(e) => handleFieldChange(property._id, 'owner_name', e.target.value)}
                    className="w-auto pl-2 pr-2 min-h-[40px] bg-transparent border-none outline-none text-start font-medium resize-none"
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
                    className="w-auto min-h-[40px] text-center bg-transparent border-none outline-none font-medium"
                  />
                </td>

                <td className="border p-0">
                  <select 
                    className="font-medium min-h-[40px] w-auto pl-2 pr-2"
                    value={property.data.furniture || '-'}
                    onChange={(e) => handleFieldChange(property._id, 'furniture', e.target.value)}
                  >
                    <option className="bg-[#f5f790] font-medium" value="">Select Furniture</option>
                    {furnitureOptions.map((option) => (
                      <option className="bg-[#af6d6d] font-medium text-white" key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>

                <td className="border p-0">
                  <select 
                    className="font-medium min-h-[40px] w-auto pl-2 pr-2"
                    value={property.data.status || '-'}
                    onChange={(e) => handleFieldChange(property._id, 'status', e.target.value)}
                  >
                    <option className="font-medium bg-[#14281D] text-white" value="">Select Status</option>
                    {statusOptions.map((option) => (
                      <option key={option} className="font-medium bg-[#dcd697]" value={option}>{option}</option>
                    ))}
                  </select>
                </td>

                <td className={`border p-0 ${isFieldMissing(property.data.remark) ? '' : ''}`}>
                  <textarea
                    value={property.data.remark || ''}
                    onChange={(e) => handleFieldChange(property._id, 'remark', e.target.value)}
                    className="w-auto pl-2 pr-2 min-h-[40px] bg-transparent border-none outline-none text-start font-medium resize-none"
                    rows="2"
                    onInput={(e) => {
                      e.target.style.height = "40px"; // Reset height
                      e.target.style.height = `${e.target.scrollHeight}px`; // Expand based on content
                    }}
                  />
                </td>

                <td className="p-2 border sticky right-0 bg-white">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">
                    Save Changes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}