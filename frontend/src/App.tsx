import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSocket } from './context/SocketContext.tsx';
import { useAuthStore } from './stores/useAuthStore.ts';
import { useBrandKitStore } from './stores/useBrandKitStore.ts';

import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import GenerationPage from "./pages/GenerationPage";
import ResultsPage from "./pages/ResultsPage";
// import BrandingCanvasPage from "./pages/BrandingCanvasPage"
import BrandingWorkspace from "./pages/BrandingWorkspace";

const SocketConnector = () => {
    const { socket } = useSocket();
    const { initializeSocketListeners } = useBrandKitStore();
    const { token } = useAuthStore();

    useEffect(() => {
        if (socket && token) {
            // Tell the brand kit store to start listening for updates
            initializeSocketListeners(socket);
        }
    }, [socket, token, initializeSocketListeners]);

    return null; // This component renders nothing to the UI
};
function App() {
  return (
    <Router>
      <SocketConnector/>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<BrandingWorkspace />} />
          {/* <Route path="/dashboard" element={<BrandingCanvasPage/>} /> */}
          <Route path="/generate" element={<GenerationPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
