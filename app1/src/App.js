import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ReportLostItem from "./pages/ReportLostItem";
import ReportedItems from "./pages/ReportedItems";
import ItemDetail from "./pages/ItemDetail";
import ReportFound from "./pages/ReportFound";
import FoundItems from "./pages/FoundItems";
import Browse from "./pages/Browse";
import ClaimItem from "./pages/ClaimItem";
import ClaimChat from "./pages/ClaimChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/report-lost" element={<ReportLostItem />} />
        <Route path="/reported-items" element={<ReportedItems />} />
        <Route path="/item/:id" element={<ItemDetail type="lost" />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/found-item/:id" element={<ItemDetail type="found" />} />

        <Route path="/browse" element={<Browse />} />
        <Route path="/claim/:id" element={<ClaimItem />} />
        <Route path="/claim-chat/:claimId" element={<ClaimChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
