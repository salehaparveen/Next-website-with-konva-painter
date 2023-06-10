import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Swal from "sweetalert2";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function sendNewRole(data) {
  const response = await fetch("/api/employee/changerole", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export default function EmployeeProfile(props) {
  //console.log(props);

  const {
    cognitoId,
    createdBy,
    createdOn,
    email,
    firstName,
    id,
    initialPassword,
    lastName,
    roleDescription,
    roleId,
    updateAt,
    updatedBy,
    lastDeactivatedBy,
    lastDeactivatedDate,
    lastActivatedBy,
    lastActivatedDate,
    oldRoleId,
    oldRoleDescription,
    roleUpdateDate,
    roleUpdatedBy,
    lastSignedInDate,
    lastPasswordUpdateDate
  } = props.item;

  const { currentRoleId } = props;
  let formatedDeactivatedDate,
    formatedActivatedDate,
    formatedRoleUpdatedDate, formatedLastSignedInDate, formatedPasswordUpdateDate = "";

  if (lastDeactivatedDate) {
    formatedDeactivatedDate = formatDate(lastDeactivatedDate);
  }

  if (lastActivatedDate) {
    formatedActivatedDate = formatDate(lastActivatedDate);
  }

  if (roleUpdateDate) {
    formatedRoleUpdatedDate = formatDate(roleUpdateDate);
  }

  if(lastSignedInDate){
    formatedLastSignedInDate = formatDate(lastSignedInDate);
  }

  if(lastPasswordUpdateDate){
    formatedPasswordUpdateDate = formatDate(lastPasswordUpdateDate);
  }

  const [changeRole, setChangeRole] = useState(false);
  const [selectedRole, setRole] = useState();

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

  const router = useRouter();

  async function saveNewRole() {
    if (selectedRole) {
      const result = await sendNewRole({
        oldRoleId: roleId,
        newRoleId: selectedRole,
        empEmail: email,
      });

      if (result.status == 401) {
        signIn();
      }

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-light ms-3",
        },
        buttonsStyling: false,
      });

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
          setChangeRole(false);
          router.push("/employees/profile/" + id);
        }
      }
    }
  }

  function roleSelectionHandler(value, description) {
    setRole(value);
  }

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>First Name: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm">
                {firstName}
              </label>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>Last Name: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm">
                {lastName}
              </label>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>Email: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm">
                {email}
              </label>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>Role: </strong>
              </label>

              {!changeRole && (
                <label className="col-sm-8 col-form-label col-form-label-sm  d-flex align-items-center">
                  {roleDescription}
                  <button
                    type="button"
                    className="btn btn-warning btn-sm ms-3"
                    onClick={(e) => setChangeRole(true)}
                  >
                    Change
                  </button>
                </label>
              )}
              {changeRole && (
                <div className="col-sm-8 col-form-label col-form-label-sm  d-flex align-items-center">
                  <select
                    className="form-select me-3"
                    onChange={(event) =>
                      roleSelectionHandler(
                        event.target.value,
                        event.target[event.target.selectedIndex].text
                      )
                    }
                    required
                  >
                    <option value="">--- Select New Role ---</option>
                    {roles.map((role, i) => {
                      if (role.roleid != roleId) {
                        return (
                          <option value={role.roleid} key={i}>
                            {role.description}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <button
                    type="button"
                    className="btn btn-light btn-sm ms-1"
                    onClick={(e) => setChangeRole(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm ms-2"
                    onClick={(e) => saveNewRole()}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col">
                <hr />
              </div>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>Created By: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm">
                {createdBy}
              </label>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>Created On: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm">
                {formatDate(createdOn)}
              </label>
            </div>

            {updatedBy && (
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Updated By: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm">
                  {updatedBy ? { updatedBy } : <span>N/A</span>}
                </label>
              </div>
            )}

            {updateAt && (
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Updated On: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm">
                  {updateAt ? formatDate({ updateAt }) : <span>N/A</span>}
                </label>
              </div>
            )}

            <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                <strong>Temporary Password: </strong>
              </label>
              <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                {initialPassword ? (
                  <span className="badge rounded-pill text-bg-warning">
                    YES - Employee NEEDS to complete registration.
                  </span>
                ) : (
                  <span>NO</span>
                )}
              </label>
            </div>

            {oldRoleId && (
              <div className="row">
                <div className="col">
                  <hr />
                </div>
              </div>
            )}

            {oldRoleId && (
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                  <strong>Old Role: </strong>
                </label>
                <div className="col-sm-8 col-form-label col-form-label-sm ">
                  <div>{oldRoleDescription}</div>
                  <div>
                    <small>
                      <strong>CHANGED BY: </strong>
                      {roleUpdatedBy}
                    </small>
                  </div>
                  <div>
                    <small>
                      <strong>CHANGED ON: </strong>
                      {formatedRoleUpdatedDate}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {lastPasswordUpdateDate && (
              <div className="row">
              <label className="col-sm-3 col-form-label col-form-label-sm d-inline-block text-end align-self-center">
                <strong>Last Password Updated On: </strong>
              </label>
              <div className="col-sm-8 col-form-label col-form-label-sm ">
                <div>{formatedPasswordUpdateDate}</div>
              </div>
            </div>
            )}
          </div>

          {currentRoleId == 0 && ( //only available for webmaster
            <div className="col">
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>ID: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {id}
                </label>
              </div>
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Cognito Id: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {cognitoId}
                </label>
              </div>
              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Role Id: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {roleId}
                </label>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Old Role Id: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {oldRoleId} - {oldRoleDescription}
                </label>
              </div>

              <div className="row">
                <div className="col">
                  <hr />
                </div>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Last Deactivation Date: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {formatedDeactivatedDate ? (
                    <span>{formatedDeactivatedDate} </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </label>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Changed to Inactive By: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {lastDeactivatedBy ? (
                    <span>{lastDeactivatedBy} </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </label>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Last Activation Date: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {formatedActivatedDate ? (
                    <span>{formatedActivatedDate} </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </label>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Changed to Active By: </strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {lastActivatedBy ? (
                    <span>{lastActivatedBy} </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </label>
              </div>

              <div className="row">
                <label className="col-sm-3 col-form-label col-form-label-sm text-end">
                  <strong>Last Signed In Date:</strong>
                </label>
                <label className="col-sm-8 col-form-label col-form-label-sm d-flex align-items-center">
                  {lastSignedInDate ? (
                    <span>{formatedLastSignedInDate} </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </label>
              </div>

            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
