import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import {
  Users,
  Grid,
  FileText,
  Settings,
  LogOut,
  Key,
  Menu,
  X,
} from "react-feather";
import Image from "next/image";
import { signOut } from "next-auth/react";

function Sidebar(props) {
  const { session, isExpanded, setIsExpanded } = props;

  const router = useRouter();
  const iconSizeSidebarShort = 24;

  return (
    <Fragment>
      <div className="bg-dark pt-0 d-md-block sidebar">
        {isExpanded ? (
          <div className="sidebar-sticky sidebar-full bg-dark">
            <div className="position-relative bg-light pt-2">
              <button
                type="button"
                className="btn btn-secondary position-absolute end-0 me-2"
                onClick={() => setIsExpanded(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="text-center bg-light pt-1 pb-3 mb-3">
              <div className="text-white p-2 "></div>

              <Image
                src="/logo/logox320.png"
                alt="Property Fence LLC Logo"
                width="150"
                height="90"
                as="image"
              />
              <span className="d-block mt-2 fw-bolder">
                MANAGEMENT SYSTEM
                <br />
                (PFMS)
                {process.env.NEXT_PUBLIC_ENVIRONMENT &&
                  process.env.NEXT_PUBLIC_ENVIRONMENT == "DEV" && (
                    <div className="d-flex justify-content-center bg-danger">
                      <div className="p-2 text-white">DEVELOPMENT</div>
                    </div>
                  )}
              </span>
            </div>
            <div className="ps-2 pe-2 pt-2">
              <nav>
                <Link
                  href="/"
                  className={
                    router.pathname == "/" ? "nav-link active" : "nav-link"
                  }
                >
                  <Grid size={16} />
                  &nbsp;&nbsp;Dashboard
                </Link>
                <Link
                  href="/estimates"
                  className={
                    router.pathname.startsWith("/estimates")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <FileText size={16} />
                  &nbsp;&nbsp;Estimates
                </Link>
                <Link
                  href="/customers"
                  className={
                    router.pathname.startsWith("/customers")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <Users size={16} />
                  &nbsp;&nbsp;Customers
                </Link>
              </nav>
            </div>

            {/* the following section is only available to 0: webmaster, 1: owner, 2: manager */}

            <div className="ps-2 pe-2">
              <hr className="text-muted" />
              {/* <h6 className=" text-muted text-uppercase">
    <span>Administration</span>
  </h6> */}
              <nav>
                {(session.user.roleId == 0 ||
                  session.user.roleId == 1 ||
                  session.user.roleId == 2) && (
                  <Link
                    href="/employees"
                    className={
                      router.pathname == "/employees"
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    <Settings size={16} />
                    &nbsp;&nbsp;Manage Employees
                  </Link>
                )}

                <Link
                  href="/myprofile"
                  className={
                    router.pathname == "/myprofile"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <Key size={16} />
                  &nbsp;&nbsp;Manage Password
                </Link>
              </nav>
            </div>

            <div className="logout-btn-container d-flex align-items-center pt-3 pb-3">
              <button
                type="button"
                className="btn btn-dark btn-sm d-inline"
                onClick={() => signOut({ redirect: false })}
              >
                <LogOut size={16} /> Logout
              </button>
              <div className="text-muted text-center small d-inline ms-5">
                <span>V. {process.env.SITE_VERSION}</span>
              </div>
            </div>
          </div>
        ) : (
          //short
          <div className="sidebar-sticky sidebar-short bg-dark">
            <div className="text-white p-1">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setIsExpanded(true)}
              >
                <Menu size={iconSizeSidebarShort} />
              </button>
            </div>
            <div className="text-center bg-light pt-3 pb-3">
              <Image
                src="/logo/logo-4x.png"
                alt="Property Fence LLC"
                width="50"
                height="25"
                priority="1"
              />
            </div>
            <div className=" ps-2 pe-2 pt-2">
              <nav>
                <Link
                  href="/"
                  className={
                    router.pathname == "/" ? "nav-link active" : "nav-link"
                  }
                >
                  <Grid size={iconSizeSidebarShort} />
                </Link>
                <Link
                  href="/estimates"
                  className={
                    router.pathname.startsWith("/estimates")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <FileText size={iconSizeSidebarShort} />
                </Link>
                <Link
                  href="/customers"
                  className={
                    router.pathname.startsWith("/customers")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <Users size={iconSizeSidebarShort} />
                </Link>
              </nav>
            </div>

            {/* the following section is only available to 0: webmaster, 1: owner, 2: manager */}

            <div className="ps-2 pe-2">
              <hr className="text-muted" />
              {/* <h6 className=" text-muted text-uppercase">
              <span>Administration</span>
            </h6> */}
              <nav>
                {(session.user.roleId == 0 ||
                  session.user.roleId == 1 ||
                  session.user.roleId == 2) && (
                  <Link
                    href="/employees"
                    className={
                      router.pathname == "/employees"
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    <Settings size={iconSizeSidebarShort} />
                  </Link>
                )}

                <Link
                  href="/myprofile"
                  className={
                    router.pathname == "/myprofile"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <Key size={iconSizeSidebarShort} />
                </Link>
              </nav>
            </div>

            <div className="logout-btn-container d-flex align-items-center pt-3 pb-3">
              <button
                type="button"
                className="btn btn-dark btn-sm d-inline"
                onClick={() => signOut({ redirect: false })}
              >
                <LogOut size={iconSizeSidebarShort} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Sidebar;
