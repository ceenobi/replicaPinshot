import { GoHome } from "react-icons/go";
import { MdOutlineExplore } from "react-icons/md";
import { PiCameraPlus } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "@hooks";

export default function Footer() {
  const { setShowSearch, showSearch, loggedInUser } = useAuthContext();
  const location = useLocation();

  const links = [
    {
      id: 1,
      Icon: GoHome,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      Icon: MdOutlineExplore,
      name: "Explore",
      path: "/explore",
    },
    {
      id: 3,
      Icon: PiCameraPlus,
      name: "Create",
      path: "/create-pin",
    },
  ];

  return (
    <div
      className={
        location.pathname === "/" && !loggedInUser
          ? "d-none"
          : "d-block d-md-none position-sticky bottom-0 w-100 p-3 bg-white z-3"
      }
    >
      <div className="d-flex align-items-center justify-content-between text-center">
        {links.map(({ id, Icon, name, path }) => (
          <NavLink
            to={path}
            key={id}
            className={({ isActive }) =>
              isActive ? "activeLink fw-bold" : "no-activeLink fw-bold"
            }
          >
            <div className="d-flex flex-column align-items-center">
              <Icon style={{ fontSize: "30px" }} />
              <span style={{ fontSize: "14px" }}>{name}</span>
            </div>
          </NavLink>
        ))}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? "activeLink fw-bold" : "no-activeLink fw-bold"
          }
          onClick={() => {
            setShowSearch(!showSearch);
          }}
        >
          <div className="d-flex flex-column align-items-center">
            <FiSearch size="30px" />
            <span style={{ fontSize: "14px" }}>Search</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
