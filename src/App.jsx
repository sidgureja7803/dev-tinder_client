import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import OTPVerification from "./components/OTPVerification";
import ForgotPassword from "./components/ForgotPassword";
import './firebase/config';

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          
          {/* Protected routes */}
          <Route path="/app">
            <Route index element={<Navigate to="feed" replace />} />
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            <Route path="premium" element={<Premium />} />
            <Route path="chat/:targetUserId" element={<Chat />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
