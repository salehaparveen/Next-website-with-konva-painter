import { useSession, signOut, signIn } from "next-auth/react";
import { Fragment } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { User, LogOut } from "react-feather";

function MainNavigation() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <Fragment>
        <Navbar
          bg="dark"
          expand="lg"
          variant="dark"
          className="sticky-top flex-md-nowrap shadow custom-bg-color"
        >
          <Navbar.Brand href="/" className="col-auto me-auto me-0 px-3 fs-6">
            Property Fence LLC
          </Navbar.Brand>
          <Nav>
            <NavDropdown
              title={
                <span>
                  &nbsp;{session.user.firstName} {session.user.lastName}
                </span>
              }
              id="basic-nav-dropdown"
              className="col-auto"
            >
              <NavDropdown.Item href="/myprofile">
                Profile
              </NavDropdown.Item>
              {/* <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item> */}
              {/* <NavDropdown.Divider /> */}
            </NavDropdown>
            <Nav.Item className="col-auto">
              <Nav.Link
                href=""
                onClick={() => signOut({callbackUrl: '/login'})}
                className="nav-link px-3"
              >
                <span>
                  Log Out <LogOut size={14} />
                </span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }else{
    signIn();
  }
}

export default MainNavigation;
