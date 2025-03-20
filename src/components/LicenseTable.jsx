
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import GETService ,{postAPI} from "../assets/Services/GETService";
import CustomerDetailsModal from './CustomerDetailsModal';
import './CssFiles/LicenseTable.css';
import { BiSave } from "react-icons/bi";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";

// Utility function to format date as dd/MM/yyyy.
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// Table columns configuration, including a hidden Customer ID column.
const columns = [
  {
    name: 'Customer ID',
    selector: row => row.licenseid,
    omit: true, // Hidden column.
  },
  {
    name: 'Customer Name',
    selector: row => row.customer_name,
    sortable: true,
    cell: row => (
      <span 
        className="clickable" 
        onClick={() => row.handleNameClick(row.licenseid)}
      >
        {row.customer_name}
      </span>
    )
  },
  {
    name: 'Machine Name',
    selector: row => row.machine_name,
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => row.status,
    sortable: true,
  },
  {
    name: 'Activated Date',
    selector: row => formatDate(row.activated_date),
    sortable: true,
  },
  {
    name: 'Expiry Date',
    selector: row => formatDate(row.expiry_date),
    sortable: true,
  },
  {
    name: 'Warning Days',
    selector: row => row.warningdaysbeforeexpiry,
    sortable: true,
  },
  {
    name: 'Remarks',
    selector: row => row.remarks,
    sortable: true,
  },
];

export default function CardWithDataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  // Handle click on customer name.
  const handleNameClick = (customerId) => {
    setSelectedCustomerId(customerId);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) {
      // Refetch data when the modal closes
      setLoading(true);
      GETService("License", "GetAllCustomers", "")
        .then(response => {
          const enrichedData = response.data.map(row => ({
            ...row,
            handleNameClick: handleNameClick,
          }));
  
          // Sorting by primary key (assumed as 'id', replace if needed)
          const sortedData = enrichedData.sort((a, b) => a.licenseid - b.licenseid); 
  
          setData(sortedData);
          setFilteredData(sortedData);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching license data:", error);
          setLoading(false);
        });
    }
  }, [modalOpen]);
  

  useEffect(() => {
    const filtered = data.filter(row =>
      Object.entries(row).some(([key, value]) => {
        if (value === null || value === undefined) return false; // Skip null/undefined values
  
        if (key === "expiry_date"||key==="activated_date") {
          return formatDate(value).toLowerCase().includes(search.toLowerCase());
        }
        
  
        return value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  
    setFilteredData(filtered);
  }, [search, data]);
  
  const handleSyncLicense = () => {
    postAPI("License", "SyncLicense", {})
      .then(response => {
        if (response.status=="Success") {
          Swal.fire({
            text: "License cache updated successfully!",
            icon: "success",
            confirmButtonText: "Ok"
          });
        } else {
          Swal.fire({
            text: response.message || "An error occurred while updating the license cache.",
            icon: "error",
            confirmButtonText: "Ok"
          });
        }
      })
      .catch(error => {
        console.error("Error syncing license cache:", error);
        Swal.fire({
          text: "An unexpected error occurred. Please try again.",
          icon: "error",
          confirmButtonText: "Ok"
        });
      });
  };
  
  
  return (
    <div className="card">
      <div className="p-2">
        <div className='flex-wrap align-items-center justify-content-center justify-content-lg-start'> 
          <div className='row-reverse-flex'>
          <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control search-input"
              />
            </div>
            <div className='  col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
            <button className='btn btn-sm btn-primary' id="syncLicenseForm" onClick={handleSyncLicense}>
              <BiSave></BiSave> Update License Cache
            </button>
            </div>
           
              
          </div>
          <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
            <h6 className='Wheader-1 '>Customer Licenses:</h6>
          </div> 
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          fixedHeader
          fixedHeaderScrollHeight="350px"
          pagination
          paginationComponentOptions={paginationComponentOptions}
          highlightOnHover
          customStyles={customStyles}
          progressPending={loading}
        />
      </div>
      <CustomerDetailsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        customerId={selectedCustomerId} 
      />
    </div>
  );
}
const customStyles = {
  headCells: {
    style: {
      fontSize: "0.85rem",
      fontWeight: "bold",
    },
  },
  cells: {
    style: {
      fontSize: "0.85rem",
    },
  },
};

const paginationComponentOptions = {

	selectAllRowsItem: true,
	selectAllRowsItemText: 'Show All',
};