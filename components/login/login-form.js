import { useState, useEffect, Fragment } from "react";
import { signIn } from "next-auth/react";
import Notification from "../ui/notification";


function passwordChecker(password) {
  let errorCode = [];
  let goodCode = [];

  if (password.length < 8) {
    errorCode.push("1");
  } else {
    goodCode.push("1");
  }

  if (password.search(/[a-z]/) < 0) {
    errorCode.push("3");
  } else {
    goodCode.push("3");
  }

  if (password.search(/[A-Z]/) < 0) {
    errorCode.push("2");
  } else {
    goodCode.push("2");
  }

  if (password.search(/[0-9]/) < 0) {
    errorCode.push("4");
  } else {
    goodCode.push("4");
  }

  if (password.search(/.*[!@#$%^&*() =+_-]/) < 0) {
    errorCode.push("5");
  } else {
    goodCode.push("5");
  }

  return { errorCode: errorCode, goodCode: goodCode };
}

function LoginForm(props) {

  const passwordRequirements = [
    {
      requirementId: 1,
      title: "Minimum 8-characters long",
      isOk: false,
      error: false,
    },
    {
      requirementId: 2,
      title: "At Least an Uppercase Letter",
      isOk: false,
      error: false,
    },
    {
      requirementId: 3,
      title: "At Least a Lowercase Letter",
      isOk: false,
      error: false,
    },
    {
      requirementId: 4,
      title: "At Least a Number",
      isOk: false,
      error: false,
    },
    {
      requirementId: 5,
      title: "At Least One Special Character '!@#$%^&*()=+_-' ",
      isOk: false,
      error: false,
    },
  ];

  let firstTime = false;
  let passwordLabel = "Password";
  let buttonPosition = "text-center"; //ms-auto
  let emailReceived = "";
  let emailReadOnly = false;

  if (props.firstTime) {
    firstTime = props.firstTime;
    buttonPosition = "text-center";
    passwordLabel = "New Password";
    emailReceived = props.email;
    emailReadOnly = true;
  }



  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const [requestSuccessMsg, setSuccessMsg] = useState();
  const [inlineError, setInlineError] = useState();
  const [getEmail, setEmail] = useState(emailReceived);

  const [passwordNotification, setPasswordNotification] = useState({
    items: passwordRequirements,
  });

  function newPasswordHandler(password) {
    setInlineError("");
    let newPasswordRequirementSet = passwordNotification.items.slice();

    if (password.length > 0) {
      const response = passwordChecker(password);
      newPasswordRequirementSet.forEach((requirement) => {
        //check for error
        if (response.errorCode.length > 0) {
          response.errorCode.forEach((value) => {
            if (requirement.requirementId == value) {
              requirement.error = true;
              requirement.isOk = false;
            }
          });
        }

        //ok
        response.goodCode.forEach((value) => {
          if (requirement.requirementId == value) {
            requirement.error = false;
            requirement.isOk = true;
          }
        });
      });

      //console.log(response);
      if (response.errorCode.length == 0) {
        //setNewPassword(password);
        setInlineError("");
        //setNewPassFieldOk(true);
      } else {
        //setNewPassword("");
        setInlineError("Your password MUST meet all requirements.");
        //setNewPassFieldOk(false);
      }
    } else {
      newPasswordRequirementSet.forEach((requirement) => {
        requirement.isOk = false;
        requirement.error = false;
      });
      //setNewPassFieldOk(false);
    }

    setPasswordNotification({
      items: newPasswordRequirementSet,
    });
  }

  

  useEffect(() => {
    if (requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  async function submitHandler(event) {
    event.preventDefault();

    setRequestStatus("pending");

    let enteredPassword,
      newPassword,
      enteredEmail = "";

    if (firstTime) {
      enteredPassword = event.target.temppassword.value;
      newPassword = event.target.password.value;
      enteredEmail = getEmail;

    } else {
      enteredPassword = event.target.password.value;
      enteredEmail = event.target.email.value;
    }

    const result = await signIn("credentials", {
      email: enteredEmail,
      password: enteredPassword,
      newPassword: newPassword,
      redirect: false,
      callbackUrl: `${window.location.origin}`
    });

    if (result.error) {
      setRequestError(
        result.error || "Something went wrong! Refresh page and try again."
      );
      setRequestStatus("error");
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Verifying your identity...",
      message: "Your credentials are being validated.",
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
    <Fragment>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3">
            <div className="row">
              <div className="col">
                <img
                  src="../logo/logox320.png"
                  width={200}
                  alt="Property Fence LLC - Logo"
                  className="mb-5 mx-auto d-block img-fluid"
                />
              </div>
            </div>

            { inlineError && (
              <div className="row">
                <div className="col">
                  <div className="alert alert-danger" role="alert">
                    {inlineError}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col">
                <form onSubmit={submitHandler}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      aria-describedby="emailHelp"
                      required
                      name="email"
                      defaultValue={getEmail}
                      disabled={emailReadOnly}
                    />
                  </div>
                  {firstTime && (
                    <div className="mb-3">
                      <label className="form-label">Temporary Password</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        name="temppassword"
                      />
                    </div>
                  )}

                  {firstTime ? (
                   <div className="mb-3">
                    <label className="form-label">{passwordLabel}</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      name="password"
                      onChange={(e) => newPasswordHandler(e.target.value)}
                    />
                  </div> 
                  ) : (
                    <div className="mb-3">
                    <label className="form-label">{passwordLabel}</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      name="password"
                    />
                  </div>
                  )}
                  
                  {firstTime && (
                    <div className="row">
                    <div className="col-sm-8 col-form-label col-form-label-sm ms-2 text-sm ">
                      <small><p className="m-0"><strong>PASSWORD REQUIREMENTS:</strong></p>
                      {passwordNotification.items.map((requirement, i) => {
                        let textColor;
                        if (requirement.isOk) {
                          textColor = "text-success";
                        } else if (requirement.error) {
                          textColor = "text-danger";
                        } else {
                          textColor = "text-muted";
                        }
                        const divClass = `small ${textColor}`;
      
                        return (
                          <div className={divClass} key={i}>
                            <span>{requirement.title}.</span>
                          </div>
                        );
                      })}
                      </small>
                    </div>
                  </div>
                  )}
                  <div className="d-flex mb-3 pt-2 justify-content-center">
                    {/* {!firstTime && (
                      <div className="align-self-center">Forgot Password?</div>
                    )} */}

                    <div className={buttonPosition}>
                      <button type="submit" className="btn btn-primary">
                        Log In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {notification && (
          <Notification
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
      </div>
    </Fragment>
  );
}

export default LoginForm;
