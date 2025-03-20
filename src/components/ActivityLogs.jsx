

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import GETService from "../assets/Services/GETService";

// Utility function to format date as dd/MM/yyyy, handling null values
function formatDate(date) {
  if (!date) return "-"; // Handle null or undefined dates
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) return "-"; // Handle invalid dates

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


// Table columns configuration
const columns = [
  {
    name: 'Customer Name',
    selector: row => row.customer_name || "-",  // Handle null values
    sortable: true,
  },
  {
    name: 'IP address',
    selector: row => row.ipaddress || "-",  // Handle null values
    sortable: true,
  },
  {
    name: 'License Status',
    selector: row => row.license_status || "-",
    sortable: true,
  },
  {
    name: 'Updated Date',
    selector: row => formatDate(row.updated_date),
    sortable: true,
  },
  {
    name: 'Remarks',
    selector: row => row.remarks || "-",
    sortable: true,
    width: '450px',
    cell: row => (
      <div title={row.remarks || "-"} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
        {row.remarks || "-"}
      </div>
    ),
  },
  {
    name: 'Updated By',
    selector: row => row.updated_by || "-",
    sortable: true,
  },
];

export default function LogActivitiesTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    GETService("Logging", "GetLogActivities", "")
      .then(response => {
        let sortedData = (response.data || []).sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date)); // Sort by date descending
        setData(sortedData);
        setFilteredData(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching log activities:", error);
        setLoading(false);
      });
  }, []);
  

  useEffect(() => {
    const filtered = data.filter(row => 
      Object.entries(row).some(([key, value]) => {
        if (!value) return false;
  
        if (key === "updated_date") {
          return formatDate(value).toLowerCase().includes(search.toLowerCase());
        }
  
        return value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
  
    setFilteredData(filtered);
  }, [search, data]);
  
  
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
          </div>
          <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
            <h6 className='Wheader-1 '>Log Activities:</h6>
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
    </div>
  );
}
const paginationComponentOptions = {

	selectAllRowsItem: true,
	selectAllRowsItemText: 'Show All',
};
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
