import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyHabits from "./pages/MyHabits";
import AddHabitForm from "./pages/AddHabitForm";
import DailyDashboard from "./pages/DailyDashboard";
import Insights from "./pages/Insights";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ToastProvider from "./components/Toast";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DailyDashboard />} />
        <Route path="/habits" element={<MyHabits />} />
        <Route path="/habits/new" element={<AddHabitForm />} />
        <Route path="/habits/edit/:id" element={<AddHabitForm />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastProvider />
    </>
  );
}
