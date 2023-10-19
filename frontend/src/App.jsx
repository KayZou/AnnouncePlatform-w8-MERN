import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authenticate from "./users/pages/Authenticate";
import Dashboard from "./users/pages/Dashboard";
import NotFound from "./shared/pages/404";
import Home from "./shared/pages/Home";
import AllJobs from "./shared/pages/AllJobs";
import JobView from "./Jobs/components/JobView";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/:jid" element={<JobView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
