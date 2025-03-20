

import React, { useState, useEffect,useRef } from "react";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component"; // Import DataTable for the application table
import "./CssFiles/CustomerDetailsModal.css"; // Your custom CSS
import GETService, { postAPI } from "../assets/Services/GETService";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { BiSave } from "react-icons/bi";
import { BiX } from "react-icons/bi";

export default function LicenseDetailsModal({ isOpen, onClose, customerId }) {
  const [licenseData, setLicenseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [warningcount, setwarningcount] = useState("");
  const [warningdays, setWarningdays] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [applicationData, setApplicationData] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const fetchLicenseDetails = () => {
    if (customerId && isOpen) {
      setLoading(true);
      setLoadingApplications(true);

      // Fetch license details
      GETService("License", "GetCustomerDetails", {}, { licenseId: customerId })
        .then(response => {
          if (response.isSuccess && response.data) {
            const modal = JSON.parse(response.data);
            setLicenseData(modal.customer);
            setStatus(modal.customer.status);
            setRemarks(modal.customer.remarks || "");
            setwarningcount(modal.customer.warningcount);
            setWarningdays(modal.customer.warningdaysbeforeexpiry);
            const parsedDate = modal.customer.expiry_date ? new Date(modal.customer.expiry_date) : null;
            setExpiryDate(parsedDate);
            setInputValue(ConvertToCustomDate(parsedDate));
            setLoading(false);
          } else {
            alert("Something went wrong!");
            setLoading(false);
          }
        })
        .catch(error => {
          console.error("Error fetching license data:", error);
          setLoading(false);
        });

      // Fetch license application details
      GETService("License", "GetCustomerLinkedApplications", {}, { licenseid: customerId })
        .then(response => {
          if (response.isSuccess && response.data) {
            const modal = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

            // Sorting by primary key (assuming it's 'id' or replace with actual key)
            const sortedData = (modal || []).sort((a, b) => a.licenseapplicationid - b.licenseapplicationid);

            setApplicationData(sortedData);
            setFilteredData(sortedData);
            setLoadingApplications(false);
          } else {
            alert("Something went wrong while fetching application details!");
            setLoadingApplications(false);
          }
        })
        .catch(error => {
          console.error("Error fetching license application data:", error);
          setLoadingApplications(false);
        });

    }
  };
  useEffect(() => {
    fetchLicenseDetails();
  }, [customerId, isOpen]);
  const handleToggleChange = (e, row) => {
    const newStatus = e.target.checked;
    const applicationName = row.application_name; // Assuming this exists in row
    const customerName = document.getElementById("txtcustname")?.value || "Application"; // Assuming this exists in row

    Swal.fire({
      html: `Are you sure you want to <b>${newStatus ? "Enable" : "Disable"}</b> ${applicationName} for ${customerName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          licenseapplicationid: row.licenseapplicationid,
          isactive: newStatus,
        };

        postAPI("License", "UpdateApplicationStatus", payload)
          .then((response) => {
            if (response.isSuccess) {
              Swal.fire({
                html: `${applicationName} has been <b>${newStatus ? "Enabled" : "Disabled"}</b> for ${customerName}!`,
                icon: "success",
                confirmButtonText: "Ok",
              });

              fetchLicenseDetails(); // Refresh data after update
            } else {
              Swal.fire({
                text: "Failed to update status!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            }
          })
          .catch((error) => {
            console.error("Error while updating status:", error);
          });
      }
    });
  };

  const handleUpdate = () => {
    const formattedExpiryDate = ConvertToISODate(expiryDate); // Convert dd/MM/yyyy to YYYY-MM-DD
    const updatedData = {
      licenseId: customerId,
      status,
      remarks,
      warningcount,
      warningdays,
      expirydate: formattedExpiryDate
    };

    postAPI("License", "UpdateCustomerLicense", updatedData, { "Content-Type": "application/json" })
      .then(response => {
        if (response.isSuccess) {
          Swal.fire({
            text: "License details updated successfully!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: { confirmButton: "btn btn-primary" },
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });

          fetchLicenseDetails(); // Refresh table after update
        } else {
          Swal.fire({
            text: response.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: { confirmButton: "btn btn-danger" },
            showClass: { popup: 'animate__animated animate__shakeX' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
          });
        }
      })
      .catch(error => {
        console.error("Error updating license:", error);
        Swal.fire({
          text: "An error occurred while updating license details. Please try again later.",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-danger" },
          showClass: { popup: 'animate__animated animate__shakeX' },
          hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
      });
  };

  // Define columns for the license application table
  const applicationColumns = [
    {
      name: "LICENSEAPPLICATIONID",
      selector: row => row.licenseapplicationid,
      omit: true, // Hidden column
    },
    {
      name: "Application Name",
      selector: row => row.application_name || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Application Version",
      selector: row => row.application_version || "-",
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Last Accessed Date",
      selector: row => ConvertToCustomDate(row.last_accessed_date),
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Last Accessed IP",
      selector: row => row.last_accessed_ip || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Status",
      selector: row => (row.isactive ? "Active" : "Disabled"),
      sortable: true,
    },
    {
      name: "", // Toggle switch column
      cell: row => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.isactive}
            onChange={(e) => handleToggleChange(e, row)}
          />
          <span className="slider round"></span>
        </label>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  const handleManualInput = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (input.length > 8) input = input.slice(0, 8); // Restrict max length

    let formatted = input.replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3"); // Format as dd/MM/yyyy
    setInputValue(formatted);

    if (input.length === 8) {
      const day = parseInt(input.slice(0, 2), 10);
      const month = parseInt(input.slice(2, 4), 10) - 1; // Month is 0-based in JS
      const year = parseInt(input.slice(4, 8), 10);
      const dateObj = new Date(year, month, day);

      if (!isNaN(dateObj.getTime()) && dateObj.getDate() === day && dateObj.getMonth() === month) {
        setExpiryDate(dateObj);
      }
    }
  };
  const firstRender = useRef(true); // Track first render

  useEffect(() => {
    if(licenseData!=null&&licenseData!=""){
      let dtnew = ConvertToCustomDate(expiryDate);
      let dtold =ConvertToCustomDate(licenseData.expiry_date);
      if (licenseData.status!=status||dtold!=dtnew) {
        setRemarks(""); // Only reset after first render
        
      }
      else{
        setRemarks(licenseData.remarks);
      }
    }
    
    
  }, [status, expiryDate,licenseData]);
  useEffect(() => {
    const filtered = applicationData.filter(row =>
      Object.entries(row).some(([key, value]) => {
        if (value === null || value === undefined) return false; // Skip null/undefined values

        if (key === "last_accessed_date") {
          return ConvertToCustomDate(value).toLowerCase().includes(search.toLowerCase());
        }


        return value.toString().toLowerCase().includes(search.toLowerCase());
      })
    );

    setFilteredData(filtered);
  }, [search, applicationData]);


  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Expired", label: "Expired", isDisabled: true },
    { value: "Revoked", label: "Revoked" },
  ];
  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName="Modal custom-modal-dialog" backdrop="static" keyboard={false} size="lg">
      <Modal.Header className="bg-light-primary">
        <h6 className="Wheader-1 ">Customer License Details</h6>
        <Button variant="light" className="btn-close" onClick={onClose}></Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div className="fv-row">
                <div className="row form-group mb-7">
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Customer Name :</Form.Label>
                    <Form.Control className="fs-8" type="text" id="txtcustname" disabled value={licenseData.customer_name} />
                  </div>
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Machine Name :</Form.Label>
                    <Form.Control className="fs-8" type="text" disabled value={licenseData.machine_name} />
                  </div>
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Activated Date :</Form.Label>
                    <Form.Control className="fs-8" type="text" disabled value={ConvertToCustomDate(licenseData.activated_date)} />
                  </div>
                </div>

              </div>
              <div className="fv-row">
                <div className="row form-group mb-7">
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Last Warning Date :</Form.Label>
                    <Form.Control className="fs-8" type="text" disabled value={ConvertToCustomDate(licenseData.lastwarningdate)} />
                  </div>

                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Revoked Date :</Form.Label>
                    <Form.Control className="fs-8" type="text" disabled value={ConvertToCustomDate(licenseData.revoked_date)} />
                  </div>
                  {/* <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Status :</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Revoked">Revoked</option>
                    </Form.Select>
                  </div> */}
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Status :</Form.Label>
                    <Select
                      options={statusOptions}
                      value={statusOptions.find(option => option.value === status)}
                      onChange={(selectedOption) => setStatus(selectedOption.value)}
                      className="col-12 fs-8"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "4px",
                          borderColor: "#ccc",
                          boxShadow: "none",
                          maxHeight: "35px",
                        }),
                        option: (styles, { isFocused, isSelected, data }) => ({
                          ...styles,
                          backgroundColor: isSelected
                            ? "#007bff"
                            : isFocused
                              ? "#e0e0e0"
                              : "white",
                          color: data.isDisabled ? "#ccc" : isSelected ? "white" : "black",
                          cursor: data.isDisabled ? "not-allowed" : "default",
                        }),
                      }}
                    />

                  </div>
                </div>

              </div>
              <div className="fv-row">
                <div className="row form-group mb-7">
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Expiry Date:</Form.Label>

                    <div className="col-12 fs-8">
                      <DatePicker
                        key={expiryDate ? expiryDate.toString() : "default"}
                        selected={expiryDate}
                        onChange={(date) => {
                          setExpiryDate(date);
                          setInputValue(ConvertToCustomDate(date));
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className="form-control w-100 fs-8"
                        wrapperClassName="col-12"
                        minDate={new Date()} // Disables past dates
                        customInput={
                          <Form.Control
                            type="text"
                            value={inputValue}
                            onChange={handleManualInput}
                            placeholder="DD/MM/YYYY"
                          />
                        }
                      />

                    </div>

                  </div>
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Warning Count :</Form.Label>
                    <Form.Control type="text" className="fs-8" value={warningcount} onChange={(e) => setwarningcount(e.target.value)} />
                  </div>
                  <div className="mb-2 col-md-4">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Warning Prior Days :</Form.Label>
                    <Form.Control type="text" className="fs-8" value={warningdays} onChange={(e) => setWarningdays(e.target.value)} />
                  </div>
                </div>


              </div>
              <div className="fv-row">
                <div className="row form-group mb-7">
                  <div className="mb-2 col-md-12">
                    <Form.Label className="form-label text-dark fw-bolder fs-8">Remarks:</Form.Label>
                    <Form.Control as="textarea" className="fs-8" rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                </div>

              </div>
              <div className="d-flex w-full justify-content-end">
                <div className="ml-auto flex justify-end justify-content-end">
                  <Button className="btn btn-sm btn-primary" id="btnSaveParts" onClick={handleUpdate}>
                    <BiSave></BiSave> Update
                  </Button>
                </div>
              </div>
              {/* License Application Details Table */}
              <hr className="bg-danger border-2 border-top border-danger" />
              <div className="mt-4">

                <h6 className="Wheader-1 ">License Application Details</h6>
                <div className='flex-wrap align-items-center justify-content-center justify-content-lg-start'>
                  <div className='row-reverse-flex'>
                    <div className='col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3'>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search} // FIXED: Use search state instead of filteredData
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control search-input"
                      />
                    </div>
                  </div>
                </div>
                {loadingApplications ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <DataTable
                    columns={applicationColumns}
                    data={filteredData} // Ensure filtered data is being used
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    highlightOnHover
                    customStyles={customStyles}
                  />
                )}
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="success" id="btnSaveParts" onClick={handleUpdate}>Save</Button> */}
        <Button className="btn btn-sm btn-danger" onClick={onClose}><BiX></BiX> Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
const paginationComponentOptions = {

  selectAllRowsItem: true,
  selectAllRowsItemText: 'Show All',
};
const customStyles = {
  headCells: {
    style: {
      fontSize: "0.8rem",
      fontWeight: "bold",
      overflow: "visible",
      textOverflow: "clip",
    },
  },
  cells: {
    style: {
      fontSize: "0.8rem",
      whiteSpace: "normal",  // Allow text wrapping
      wordBreak: "break-word",
    },
  },
};

// Function to format a date to dd/MM/yyyy
function ConvertToCustomDate(date) {
  if (!date) return "";
  if (!(date instanceof Date)) date = new Date(date);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


// Function to convert Date object to YYYY-MM-DD string for saving
function ConvertToISODate(date) {
  if (!date) return null;
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}

