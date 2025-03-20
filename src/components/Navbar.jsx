
// import React, { useContext,Link } from "react";
// import { AuthContext } from "../AuthContext";
// import { NavLink } from "react-router-dom";
// import "../components/CssFiles/Navbar.css";


// export default function Header() {
//   const { logout } = useContext(AuthContext);
//   return (
//     <div className="bg-light">
//       <header className="p-1 border-bottom">
//         <div>
//           <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
//             <img
//               src="./LeS-Logo.png"
//               alt="Logo"
//               width="50"
//               height="50"
//               className="rounded-circle"
//             />
//             <h5 className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0 Wheader-1 ">LeS License Registration</h5>
//             <ul className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0 ms-3">
//               <li>
//                 <NavLink
//                   to="/License-Table"
//                   className={({ isActive }) =>
//                     "nav-link px-2 NavText" + (isActive ? " active" : "")
//                   }
//                 >
//                   Customer Licenses
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/ip-access-control"
//                   className={({ isActive }) =>
//                     "nav-link px-2 NavText" + (isActive ? " active" : "")
//                   }
//                 >
//                   IP Access Control
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/activity-logs"
//                   className={({ isActive }) =>
//                     "nav-link px-2 NavText" + (isActive ? " active" : "")
//                   }
//                 >
//                   Activity Logs
//                 </NavLink>
//               </li>
//             </ul>
//             <h5 className="nav col-12 col-lg-auto mb-2 justify-content-center mb-md-0 Wheader-1 "></h5>
//             <div className="dropdown text-end">
//               <a
//                 href="/"
//                 className="d-block link-dark text-decoration-none p-2"
//                 id="dropdownUser1"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <img
//                   src="./user.png"
//                   alt="User"
//                   width="32"
//                   height="32"
//                   className="rounded-circle"
//                 />

//               </a>

//               <ul
//                 className="dropdown-menu text-small skibidi"
//                 aria-labelledby="dropdownUser1"
//               >

//                 <li>
//                   <div className="dropdown-item" onClick={logout}>
//                     Sign out
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// }

import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { NavLink } from "react-router-dom";
import "../components/CssFiles/Navbar.css";

function getUsernameFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload.sub || "User"; // Return username if exists, otherwise null
  } catch (error) {
      console.error("Invalid token", error);
      return null;
  }
}
export default function Header() {
  const { logout } = useContext(AuthContext);
  return (
    <div className="bg-light">
      <header className="p-1 border-bottom">
        <div>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            {/* Logo & Title */}
            <div className="d-flex align-items-center">
              <img
                src="./LeS-Logo.png"
                alt="Logo"
                width="50"
                height="50"
                className="rounded-circle"
              />
              <h5 className="nav col-lg-auto mb-2 mb-md-0 Wheader-1 ms-2">
                LeS License Registration
              </h5>
            </div>

            {/* Navigation Links */}
            <ul className="nav col-lg-auto mb-2 justify-content-center mb-md-0 ms-3">
              <li>
                <NavLink
                  to="/License-Table"
                  className={({ isActive }) =>
                    "nav-link px-2 NavText" + (isActive ? " active" : "")
                  }
                >
                  Customer Licenses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ip-access-control"
                  className={({ isActive }) =>
                    "nav-link px-2 NavText" + (isActive ? " active" : "")
                  }
                >
                  IP Access Control
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/activity-logs"
                  className={({ isActive }) =>
                    "nav-link px-2 NavText" + (isActive ? " active" : "")
                  }
                >
                  Activity Logs
                </NavLink>
              </li>
            </ul>

            {/* User Dropdown - Moved to the Right */}
            <div className="dropdown text-end ms-auto">
              <div className="d-flex align-items-stretch flex-shrink-0">
                {/* User Name */}
                <div className="d-flex align-items-center ms-1 ms-lg-3">
                  <div className="Wheader-1" id="iUserName">
                    {getUsernameFromToken()}
                  </div>
                </div>
                <a
                  href="/"
                  className="d-block link-dark text-decoration-none p-2"
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="./user.png"
                    alt="User"
                    width="32"
                    height="32"
                    className="rounded-circle"
                  />
                </a>

                <ul
                  className="dropdown-menu text-small skibidi"
                  aria-labelledby="dropdownUser1"
                >
                  <li>
                    <div className="dropdown-item">
                      User :  <b>{getUsernameFromToken()}</b>
                    </div>
                    <hr></hr>
                    <div className="dropdown-item" onClick={logout}>
                      Sign out
                    </div>
                  </li>
                </ul>

              </div>

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
