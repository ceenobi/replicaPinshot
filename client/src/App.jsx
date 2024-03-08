import { AppRoutes } from "@routes";
import { AuthProvider } from "@config";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        pauseOnHover
        autoClose={5000}
        theme="dark"
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
