import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BusinessPage from "./pages/BusinessPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/businesses/:id" element={<BusinessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
