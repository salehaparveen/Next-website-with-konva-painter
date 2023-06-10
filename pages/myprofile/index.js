import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";

async function sendUpdateData(data) {
  const response = await fetch("/api/myprofile/changepass", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export default function MyProfile() {
  const { data: session, status } = useSession();

  if (status == "unauthenticated") {
    signIn();
  }

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

  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [inlineError, setInlineError] = useState();
  const [passwordNotification, setPasswordNotification] = useState({
    items: passwordRequirements,
  });
  const [currentPassFieldOk, setCurrentPassFieldOk] = useState(false);
  const [newPassFieldOk, setNewPassFieldOk] = useState(false);
  const [showSavePassBtn, setShowPassBtn] = useState(false);

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
        setNewPassword(password);
        setInlineError("");
        setNewPassFieldOk(true);
      } else {
        setNewPassword("");
        setInlineError("Your password MUST meet all requirements.");
        setNewPassFieldOk(false);
      }
    } else {
      newPasswordRequirementSet.forEach((requirement) => {
        requirement.isOk = false;
        requirement.error = false;
      });
      setNewPassFieldOk(false);
    }

    setPasswordNotification({
      items: newPasswordRequirementSet,
    });
  }

  function showSaveBtn() {
    if (currentPassFieldOk && newPassFieldOk) {
      setShowPassBtn(true);
    }
  }

  function hideSaveBtn() {
    setShowPassBtn(false);
  }

  function validateCurrentField(value) {
    setInlineError("");
    if (value) {
      setCurrentPassFieldOk(true);
      setCurrentPassword(value);
      showSaveBtn();
    } else {
      setCurrentPassFieldOk(false);
      setCurrentPassword("");
      hideSaveBtn();
    }
  }

  function matchNewPasswordHandler(confirmPassValue) {
    setInlineError("");
    console.log("confirmPassValue: ", confirmPassValue);
    console.log("newPassword: ", newPassword);
    if (confirmPassValue == newPassword) {
      setInlineError("");
      showSaveBtn();
    } else {
      setInlineError("Password do not match.");
      hideSaveBtn();
    }
  }

  async function updatePasswordBtnHandler() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    if (newPassword == currentPassword) {
      swalWithBootstrapButtons.fire(
        "Ooops!",
        "The NEW password is the same as the CURRENT password. No password was updated.",
        "info"
      );
    } else {
      const body = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      const result = await sendUpdateData(body);

      if (result.status == 401) {
        signIn();
      }

      if (!result.ok) {
        swalWithBootstrapButtons.fire(
          "Ooops!",
          result.statusText ||
            "Something went wrong! Refresh page and try again.",
          "error"
        );
      } else {
        const response = await result.json();
        const showAlert = await swalWithBootstrapButtons.fire(
          "Done!",
          response.message,
          "success"
        );

        if (showAlert.isConfirmed) {
          signOut({redirect: false});
        }
      }
    }
  }

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h2>My Profile</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="row mb-3">
              <div className="col">
                <div className="p-2 bg-light text-dark">
                  <strong>Personal Info</strong>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="row">
                  <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                    <strong>First Name: </strong>
                  </label>
                  <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                    {session.user.firstName}
                  </label>
                </div>

                <div className="row">
                  <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                    <strong>Last Name: </strong>
                  </label>
                  <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                    {session.user.lastName}
                  </label>
                </div>

                <div className="row">
                  <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                    <strong>Email: </strong>
                  </label>
                  <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                    {session.user.email}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="row mb-3">
              <div className="col">
                <div className="p-2 bg-light text-dark">
                  <strong>Update Password</strong>
                </div>
              </div>
            </div>

            {inlineError && (
              <div className="row">
                <div className="col">
                  <div className="alert alert-danger" role="alert">
                    {inlineError}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>Current Password: </strong>
              </label>
              <div className="col-sm-8 col-form-label col-form-label-sm ">
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  onChange={(e) => validateCurrentField(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>New Password: </strong>
              </label>
              <div className="col-sm-8 col-form-label col-form-label-sm ">
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  onChange={(e) => newPasswordHandler(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>&nbsp;</strong>
              </label>
              <div className="col-sm-8 col-form-label col-form-label-sm ms-2 ">
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
              </div>
            </div>

            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>Confirm New Password: </strong>
              </label>
              <div className="col-sm-8 col-form-label col-form-label-sm ">
                <input
                  type="password"
                  name="confirmNewPassword"
                  className="form-control"
                  onChange={(e) => matchNewPasswordHandler(e.target.value)}
                />
              </div>
            </div>

            {showSavePassBtn && (
              <div className="row mt-3 text-center">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={(e) => updatePasswordBtnHandler()}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

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


export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req }); 
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        session: session,
      },
    };
  }