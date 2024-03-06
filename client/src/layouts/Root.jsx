import { Outlet } from "react-router-dom";
import { Header, Footer } from "@components";
import { useLocation } from "react-router-dom";

export default function Root() {
  const location = useLocation();
  const paths = ["/login", "/signup"];
  const matchPaths = paths.map((path) => path);

  return (
    <>
      {!matchPaths.includes(location.pathname) && <Header />}
      <main style={{ minHeight: "95vh" }}>
        <Outlet />
      </main>
      {!matchPaths.includes(location.pathname) && <Footer />}
    </>
  );
}
