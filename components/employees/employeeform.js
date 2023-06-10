import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Notification from "../ui/notification";

async function sendEmployeeData(employeeData) {
  const response = await fetch("/api/employee/new", {
    method: "POST",
    body: JSON.stringify(employeeData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  //console.log(response);
  return response;
}

export default function EmployeeForm() {
  const roles = [
    {
      description: "WEBMASTER",
      roleid: 0,
    },
    {
      description: "OWNER",
      roleid: 1,
    },
    {
      description: "MANAGER",
      roleid: 2,
    },
    {
      description: "EMPLOYEE",
      roleid: 3,
    },
  ];

  const [enteredFirstName, setFirstName] = useState();
  const [enteredLastName, setLastName] = useState();
  const [enteredEmail, setEmail] = useState();
  const [selectedRole, setRole] = useState();

  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();

  const router = useRouter();
  
  useEffect(() => {
    if (requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }

    if (requestStatus === "success") {
      const timer = setTimeout(() => {
        router.push("/employees");
      }, 2000);
    }
  }, [requestStatus]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setRequestStatus('pending');

    const response = await sendEmployeeData({
      email: enteredEmail.toLowerCase(),
      given_name: enteredFirstName.toUpperCase(),
      family_name: enteredLastName.toUpperCase(),
      roleid: selectedRole,
    });

    if (response.status == 401) {
      signIn();
      return;
    }

    const data = await response.json();

    if(data.success){
        setRequestStatus('success');
        setSuccessMsg(data.message);
    }else{
        setRequestStatus('error');
        setRequestError(data.message);
    }

  };

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Adding employee...",
      message: "Your request is being processed.",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: requestSuccessMsg,
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  return (
    <div className="container">
      <div className="row  justify-content-md-center">
        <div className="col-6 col-md-offset-3  border rounded p-4">
          <form onSubmit={submitHandler}>
            <div className="row">
              <div className="col">
                <p>Fill out the following form and click submit.</p>
                <p>Please note:</p>
                <ul>
                  <li key={1}>
                    The new employee will receive an email with a{" "}
                    <b>temporary password</b>
                  </li>
                  <li key={2}>
                    The employee will be asked to update the password when login
                    in for the first time.
                  </li>
                </ul>
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  aria-label="First name"
                  required
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  aria-label="Last name"
                  required
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="firstname" className="form-label">
                  Role
                </label>
                <select
                  className="form-select"
                  onChange={(event) => setRole(event.target.value)}
                  required
                >
                  <option value="">--- Select Role ---</option>
                  {roles.map((role, i) => (
                    <option value={role.roleid} key={i}>
                      {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-auto me-auto">
                <Link href="/employees" className="btn btn-secondary">
                  Back
                </Link>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </div>
          </form>
          {notification && (
          <Notification
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
        </div>
      </div>
    </div>
  );
}
