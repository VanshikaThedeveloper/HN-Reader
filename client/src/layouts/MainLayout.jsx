import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// MainLayout wraps every page with the sticky Navbar
const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default MainLayout;
