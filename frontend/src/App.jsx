import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authenticate from './users/pages/Authenticate'
import Dashboard from './users/pages/Dashboard'
import NotFound from "./shared/pages/404";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/authenticate" element={<Authenticate/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}
