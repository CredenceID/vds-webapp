import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Dashboard from "./containers/dashboard/Dashboard";
import Settings from "./containers/settings/Settings";
import InformationModal from "./components/informationModal/InformationModal";
import CheckinMessage from "./components/informationModal/CheckinMessage";
import { getDeviceStatus } from "./services/Utils";

function App() {
  const [deviceStatus, setDeviceStatus] = useState("");
  useEffect(() => {
    fetchDeviceStatus();
    const interval = setInterval(() => {
      fetchDeviceStatus();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  });

  const fetchDeviceStatus = () => {
    getDeviceStatus()
      .then((response) => {
        if (response.data && response.status) {
          setDeviceStatus(response.data.deviceState);
        }
      })
      .catch((error) => {
        console.log("ERROR", error)
        if(error.message === "Network Error") {
          setDeviceStatus("VDS_NOT_RUNNING")
        }
      });
  };

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            Component={(props) => (
              <Dashboard deviceStatus={deviceStatus} {...props} />
            )}
          />
          <Route
            exact
            path="/dashboard"
            Component={(props) => (
              <Dashboard deviceStatus={deviceStatus} {...props} />
            )}
          />
          <Route
            exact
            path="dashboard/settings"
            Component={(props) => (
              <Settings deviceStatus={deviceStatus} {...props} />
            )}
          />
          <Route exact path="/checkin" element={<InformationModal />} />
          <Route exact path="/checkin/message" element={<CheckinMessage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
