import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import GETService, { postAPI } from "../assets/Services/GETService";
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from "sweetalert2";
import './CssFiles/IPAccessControl.css'
import { BiPlusCircle } from "react-icons/bi";
import { BiX } from "react-icons/bi";

// Utility function to format date as dd/MM/yyyy.
function formatDate(date) {
  if (!date) return '';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return '';
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
}

const statusOptions = [
  { value: 'Allow', label: 'Allow' },
  { value: 'Block', label: 'Block' }
];

export default function IPAccessTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ ipaccessid: null, ip_address: '', access_type: '', remarks: '' });

  const fetchData = () => {
    setLoading(true);
    GETService("IPAccess", "GetIPAccessRecords", "")
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching IP access records:", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   const filtered = data.filter(row =>
  //     Object.values(row).some(value => 
  //       value && value.toString().toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  //   setFilteredData(filtered);
  // }, [search, data]);
  useEffect(() => {
      const filtered = data.filter(row =>
        Object.entries(row).some(([key, value]) => {
          if (value === null || value === undefined) return false; // Skip null/undefined values
    
          if (key === "created_date"||key==="updated_date") {
            return formatDate(value).toLowerCase().includes(search.toLowerCase());
          }
          
    
          return value.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
    
      setFilteredData(filtered);
    }, [search, data]);
    

  const handleShow = (row = { ipaccessid: 0, ip_address: '', access_type: '', remarks: '' }) => {
    setFormData(row);
    setShow(true);
  };

  const handleClose = (refresh = true) => {
    setShow(false);
    if (refresh) fetchData();
  };


  const handleSubmit = () => {
    postAPI("IPAccess", "AddUpdateIPaccessRecord", formData)
      .then(response => {
        if (response.isSuccess) {
          Swal.fire({
            text: "IP access control details saved successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: { confirmButton: "btn btn-primary" },
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
          handleClose();
          
        } else {
          Swal.fire({
            text: response.message || "An error occurred while saving the record.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: { confirmButton: "btn btn-danger" }
          });
        }
      })
      .catch(error => {
        console.error("Error saving record:", error);
        Swal.fire({
          text: "An unexpected error occurred. Please try again.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-danger" }
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
            <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
              <Button  className="btn btn-sm btn-primary" onClick={() => handleShow()}><BiPlusCircle /> Add Record</Button>
            </div>
          </div>
          <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
            <h6 className='Wheader-1 '>IP Access Records:</h6>
          </div>
        </div>
        <DataTable
          columns={[
            {
              name: 'IP Address',
              selector: row => row.ip_address,
              sortable: true,
              cell: row => <a href="#" onClick={() => handleShow(row)}>{row.ip_address}</a>
            },
            {
              name: 'Access Type',
              selector: row => row.access_type,
              sortable: true,
            },
            {
              name: 'Remarks',
              selector: row => row.remarks,
              sortable: true,
            },
            {
              name: 'Created Date',
              selector: row => formatDate(row.created_date),
              sortable: true,
            },
            {
              name: 'Updated Date',
              selector: row => formatDate(row.updated_date),
              sortable: true,
            },
          ]}
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
      
      {/* Modal for Add/Update */}
      <Modal show={show} onHide={() => handleClose(false)}>
        <Modal.Header closeButton>
          <h6>{formData.ipaccessid ? "Update" : "Add"} IP Access</h6>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="form-label text-dark fw-bolder fs-8">IP Address <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" className="fs-8" value={formData.ip_address} onChange={(e) => setFormData({...formData, ip_address: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label  className="form-label text-dark fw-bolder fs-8">Access Type <span className="text-danger">*</span></Form.Label>
              <Select
                options={statusOptions}
                value={statusOptions.find(option => option.value === formData.access_type)}
                onChange={(selectedOption) => setFormData({...formData, access_type: selectedOption.value})}
                className="col-12 fs-8"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label  className="form-label text-dark fw-bolder fs-8">Remarks <span className="text-danger">*</span></Form.Label>
              <Form.Control className="fs-8" type="text" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-sm btn-danger" onClick={() => handleClose(false)}><BiX></BiX> Close</Button>
        
          <Button className="btn btn-sm btn-primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
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