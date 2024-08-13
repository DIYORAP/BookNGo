import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ButtonSelection from "./pages/Createevent";
import Example from "./pages/Home";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import EventVisitor from "./pages/EventVisitor";
import CartComponent from "./pages/card/item";

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/ok" element={<CartComponent />} />

        <Route path="/" element={<Example />} />
        <Route path="/in" element={<EventVisitor />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<ButtonSelection />} />
        </Route>
      </Routes>

    </BrowserRouter>

  );
}

export default App;
