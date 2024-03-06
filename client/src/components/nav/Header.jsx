import { useState, useEffect } from "react";
import {
  Image,
  Form,
  InputGroup,
  Button,
  Stack,
  Container,
  Dropdown,
} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@hooks";
import { PiCameraPlus } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { userService } from "@services";
import { logo, avatar } from "@assets";
import styles from "./nav.module.css";
import MyButton from "../MyButton";
import Tags from "./Tags";
import SearchResult from "./SearchResult";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [resultBox, setResultBox] = useState(false);
  const { loggedInUser, showSearch } = useAuthContext() || {};

  const paths = ["/search", "/search/"];
  const matchPaths = paths.map((path) => path);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setResultBox(true);
    } else {
      setResultBox(false);
    }
  }, [searchQuery]);

  const logoutUser = () => {
    userService.logout();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
      setResultBox(true);
    }
  };

  const closeSearchBox = () => {
    setResultBox(false);
    setSearchQuery("");
  };

  return (
    <div
      className={
        location.pathname === "/" && !loggedInUser ? "d-none d-md-block" : ""
      }
    >
      <Container fluid className={`${styles.navContainer} fixed-top w-100 p-3`}>
        {!showSearch ? (
          <div className="d-flex justify-content-between align-items-center position-relative">
            <Stack direction="horizontal" gap={3}>
              <NavLink to="/">
                <Image src={logo} alt="logo" style={{ width: "100px" }} />
              </NavLink>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "activeLink fw-bold d-none d-md-block"
                    : "no-activeLink fw-bold d-none d-md-block"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  isActive
                    ? "activeLink fw-bold d-none d-md-block"
                    : "no-activeLink fw-bold d-none d-md-block"
                }
              >
                Explore
              </NavLink>
            </Stack>

            <Form
              style={{ minWidth: "45%" }}
              className="d-none d-md-block mx-auto"
              onSubmit={handleSubmit}
            >
              <InputGroup className=" w-100 rounded-pill border-0 bg-secondary-subtle">
                <Form.Control
                  placeholder="Search pins, users, and tags..."
                  aria-label="Search bar"
                  className="rounded-start-pill border-0 bg-transparent p-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="none" type="submit">
                  {resultBox ? (
                    <IoCloseSharp size="20px" onClick={closeSearchBox} />
                  ) : (
                    <FiSearch size="20px" />
                  )}
                </Button>
              </InputGroup>
            </Form>

            {loggedInUser ? (
              <Stack direction="horizontal" gap={2}>
                <NavLink
                  to="/create-pin"
                  className={({ isActive }) =>
                    isActive
                      ? "activeLink d-none d-md-block"
                      : "no-activeLink d-none d-md-block"
                  }
                >
                  <PiCameraPlus size="30px" />
                </NavLink>
                <Dropdown>
                  <Dropdown.Toggle variant="none" id="dropdown-basic">
                    <Image
                      src={
                        loggedInUser?.profilePhoto
                          ? loggedInUser?.profilePhoto
                          : avatar
                      }
                      roundedCircle
                      className="object-fit-cover"
                      style={{ width: "35px", height: "35px" }}
                      alt={loggedInUser?.userName}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.ItemText className="fw-bold">
                      Hi, {loggedInUser?.userName}
                    </Dropdown.ItemText>
                    <Dropdown.Item
                      as={NavLink}
                      to={`/profile/${loggedInUser?.userName}`}
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.ItemText onClick={logoutUser} className="cursor">
                      Logout
                    </Dropdown.ItemText>
                  </Dropdown.Menu>
                </Dropdown>
              </Stack>
            ) : (
              <Stack direction="horizontal" gap={3}>
                <NavLink to="/login">
                  <MyButton
                    className={`${styles.btn} border-0 p-2 rounded-pill`}
                    style={{ minWidth: "fit-content" }}
                    text="Log in"
                  />
                </NavLink>
                <NavLink to="/signup">
                  <MyButton
                    className="d-none d-md-block border-0 bg-secondary-subtle text-dark p-2 rounded-pill"
                    style={{ minWidth: "fit-content" }}
                    text="Sign up"
                  />
                </NavLink>
              </Stack>
            )}
            {resultBox && (
              <SearchResult
                searchQuery={searchQuery}
                setResultBox={setResultBox}
              />
            )}
          </div>
        ) : (
          <div className="d-md-none position-relative">
            <Form className="d-md-none mx-auto" onSubmit={handleSubmit}>
              <InputGroup className=" w-100 rounded-pill border-0 bg-secondary-subtle">
                <Form.Control
                  placeholder="Search pins, users, and tags..."
                  aria-label="Search bar"
                  className="rounded-start-pill border-0 bg-transparent p-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="none" type="submit">
                  {resultBox ? (
                    <IoCloseSharp size="20px" onClick={closeSearchBox} />
                  ) : (
                    <FiSearch size="20px" />
                  )}
                </Button>
              </InputGroup>
            </Form>
            {resultBox && (
              <SearchResult
                searchQuery={searchQuery}
                setResultBox={setResultBox}
              />
            )}
          </div>
        )}
        {matchPaths.includes(location.pathname) && <Tags />}
      </Container>
    </div>
  );
}
