
// import React, { useState, useContext } from "react";
// import getToken from "../assets/Services/GetToken";
// import { AuthContext } from "../AuthContext";
// import "../components/CssFiles/Login.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg(""); // Reset error message on submit

//     const credentials = {
//       username: email,
//       password: password,
//     };

//     try {
//       const response = await getToken(credentials);

//       // Check if login is successful
//       if (response.isSuccess && response.data) {
//         localStorage.setItem("accessToken", response.data);
//         login(response.data);
//       } else {
//         // Login failed, show message from response
//         setErrorMsg(response.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Failed to get token:", error);
//       setErrorMsg("Login failed: An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="card p-4 shadow-lg login-card">
//         <div className="text-center">
//           <img src="./LeS-Logo.png" alt="Logo" height="40" />
//           <h4 className="mt-3" style={{ color: "royalblue" }}>
//             <strong>LeS License Registry</strong>
//           </h4>
//           {/* <h5 className="text-muted">Welcome</h5> */}
//           <h6 className="text-muted">Sign In</h6>
//         </div>
//         {errorMsg && (
//           <div className="alert alert-danger mt-3" role="alert">
//             {errorMsg}
//           </div>
//         )}
//         <form className="mb-3" onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Username *</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter your username"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password *</label>
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="mt-4">
//           <button type="submit" className="btn btn-primary w-100">
//             Sign In
//           </button>
//           </div>
          
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import getToken from "../assets/Services/GetToken";
import { AuthContext } from "../AuthContext";
import "../components/CssFiles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("sessionExpired") === "true") {
      setErrorMsg("Your session has expired. Please log in again.");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error message on submit

    const credentials = {
      username: email,
      password: password,
    };

    try {
      const response = await getToken(credentials);

      if (response.isSuccess && response.data) {
        localStorage.setItem("accessToken", response.data);
        login(response.data);
      } else {
        setErrorMsg(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to get token:", error);
      setErrorMsg("Login failed: An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4 shadow-lg login-card">
        <div className="text-center">
          <img src="./LeS-Logo.png" alt="Logo" height="40" />
          <h4 className="mt-3" style={{ color: "royalblue" }}>
            <strong>LeS License Registry</strong>
          </h4>
          <h6 className="text-muted">Sign In</h6>
        </div>
        {errorMsg && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMsg}
          </div>
        )}
        <form className="mb-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
