import { useState } from "react";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Alcance1 from "./components/Alcance1";
import Alcance2 from "./components/Alcance2";
import Alcance3 from "./components/Alcance3";
import { AuthProvider } from "./context/AuthProvider";

import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Home />} />
            <Route path="alcance1" element={<Alcance1 />} />
            <Route path="alcance2" element={<Alcance2 />} />
            <Route path="alcance3" element={<Alcance3 />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
