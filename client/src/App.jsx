import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ButtonSelection from "./pages/Createevent";
import Example from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create" element={<ButtonSelection />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
