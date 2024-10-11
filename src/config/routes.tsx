// // config/ProtectedRoute.tsx
// import React from "react";
// import {navigate}

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const isAuthenticated = !!localStorage.getItem("token"); // Example check for authentication

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
