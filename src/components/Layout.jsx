
// import React from "react";
// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// export const Layout = ({ activeKey }) => {
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <Navbar activeKey={activeKey} />
//       <div className="flex-grow-1">
//         <Outlet />
//       </div>
//       <footer className="text-center py-3 mt-auto">
//         &copy; {new Date().getFullYear()} All rights reserved.
//         Powered by <img
//               src="./LeSConnectLogos_MainLogo.png"
//               alt="Logo"
//               width="150"
//               height="30"
//             />
//       </footer>
//     </div>
//   );
// };


import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export const Layout = ({ activeKey }) => {
  const location = useLocation(); // Current route ka path get karne ke liye
  return (
    <div className="d-flex flex-column min-vh-100 footerfont">
      <Navbar activeKey={activeKey} />
      <div className="flex-grow-1">
        <Outlet />

       
      </div>
      <footer className="text-center py-3 mt-auto">
        &copy; {new Date().getFullYear()} All rights reserved.
        Powered by{" "}
        <img
          src="./LeSConnectLogos_MainLogo.png"
          alt="Logo"
          width="150"
          height="30"
        />
      </footer>
    </div>
  );
};
