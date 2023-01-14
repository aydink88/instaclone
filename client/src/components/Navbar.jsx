import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/User";
import { Navbar, Button, Nav, Modal } from "react-bootstrap";

const AppNavBar = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const { state, dispatch } = useUser();
  const navigate = useNavigate();

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/api/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setFoundUsers(results.user);
      });
  };
  return (
    <>
      <Navbar bg="light" expand="lg" className="justify-content-between px-2">
        <Navbar.Brand href={state ? "/" : "/signin"}>Instagram</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
          {state._id ? (
            <Nav className="ms-auto align-items-center">
              <div onClick={() => setShowSearchModal(true)}>
                <i className="large material-icons modal-trigger">search</i>
              </div>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/create">
                Create Post
              </Nav.Link>
              <Nav.Link as={Link} to="/myfollowingpost">
                My following Posts
              </Nav.Link>
              <Button
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  navigate("/signin");
                }}
                variant="danger"
              >
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/signin">
                Signin
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                Signup
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {foundUsers.map((item) => {
              return (
                <Link
                  key={item._id}
                  to={item._id !== state._id ? "/profile/" + item._id : "/profile"}
                  onClick={() => {
                    setSearch("");
                    setFoundUsers([]);
                    setShowSearchModal(false);
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setFoundUsers([]);
              setShowSearchModal(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowSearchModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppNavBar;
