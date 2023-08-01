import React, { useEffect, useState } from "react";
import { useFirebase } from "../../Context/Firebase";
import UserDashboard from "../../Pages/UserDashboard";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../../Pages/AdminDashboard";
import { Modal, Box, CircularProgress, Stack } from "@mui/material";

export default function DashboardWrapper() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [userRole, setUserRole] = useState(null);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/signin");
    } else
      firebase
        ?.usersInformation()
        .then((result) => {
          setUserRole(result.data().role);
          setWait(false);
        })
        .catch((error) => console.log(error));
  });
  return (
    <>
      {wait?<Stack
          sx={{
            height: "600px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000e0"
          }}
        >
          <CircularProgress sx={{color:"#f50e31"}} />
        </Stack>:userRole === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
}
