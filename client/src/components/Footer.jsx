import { GoHome } from "react-icons/go";
import { MdOutlineExplore } from "react-icons/md";
import { PiCameraPlus } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";

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
    Icon: FiSearch,
    name: "Search",
    path: "/search",
  },
  {
    id: 4,
    Icon: PiCameraPlus,
    name: "Create",
    path: "/create-pin",
  },
];

export default function Footer() {
  return (
    <div className="d-block d-md-none position-fixed bottom-0 w-100 p-3 bg-white">
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
      </div>
    </div>
  );
}
