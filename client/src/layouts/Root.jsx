import { Outlet } from "react-router-dom";
import { Header, Footer } from "@components";
import { useLocation } from "react-router-dom";

export default function Root() {
  const location = useLocation();
  const paths = ["/login", "/signup"];
  const matchPaths = paths.map((path) => path);

  return (
    <>
      <main className="min-vh-100">
        {!matchPaths.includes(location.pathname) && <Header />}
        <Outlet />
        {!matchPaths.includes(location.pathname) && <Footer />}
      </main>
    </>
  );
}
