
// import React, { useContext } from "react";
// import "./App.css";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import { AuthContext } from "./AuthContext";
// import { Layout } from "./components/Layout";
// import LicenseTable from "./components/LicenseTable";
// import IPAccessControl from "./components/IPAccessControl";
// import ActivityLogs from "./components/ActivityLogs";

// function App() {
//   const auth = useContext(AuthContext);
//   return (
//     <Router basename="/leslicensemanagementconsole">
//       <Routes>
//         {/* Login Route */}
//         <Route path="login" element={auth.isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

//         {/* Protected Routes */}
//         {auth.isAuthenticated ? (
//           <Route path="/" element={<Layout />}>
//             <Route index element={<Navigate to="License-Table" replace />} />
//             <Route path="License-Table" element={<LicenseTable />} />
//             <Route path="ip-access-control" element={<IPAccessControl />} />
//             <Route path="activity-logs" element={<ActivityLogs />} />
//           </Route>
//         ) : (
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import { AuthContext } from "./AuthContext";
import { Layout } from "./components/Layout";
import LicenseTable from "./components/LicenseTable";
import IPAccessControl from "./components/IPAccessControl";
import ActivityLogs from "./components/ActivityLogs";

function AppRoutes() {
  const auth = useContext(AuthContext);
  const location = useLocation(); // Capture the current location

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="login"
        element={auth.isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected Routes */}
      {auth.isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="License-Table" replace />} />
          <Route path="License-Table" element={<LicenseTable />} />
          <Route path="ip-access-control" element={<IPAccessControl />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
        </Route>
      ) : (
        // Preserve query parameters when redirecting to login (important for session expiry messages)
        <Route
          path="*"
          element={<Navigate to={`/login${location.search}`} replace />}
        />
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router basename="/leslicensemanagementconsole">
      <AppRoutes />
    </Router>
  );
}

export default App;
