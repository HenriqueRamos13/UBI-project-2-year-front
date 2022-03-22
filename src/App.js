import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layouts/Layout";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import { useAuth } from "./utils/context/auth";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Pages/Home";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </>
      ) : (
        <Route exact path="/" element={<Layout />}>
          <Route exact path="/app" element={<Home />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
