import { getSession, signIn, useSession } from "next-auth/react";
import { getEmployeeById } from "../../../utils/functions";
import { Fragment } from "react";
import EmployeePageHeader from "../../../components/employees/page-header";
import EmployeeNotFound from "../../../components/employees/employee-detail-notfound";
import EmployeeProfile from "../../../components/employees/profile/employee-profile";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

async function changeEmployeeStatus(body) {
  const response = await fetch("/api/employee/update", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

async function deleteEmployee(body) {
  const response = await fetch("/api/employee/remove", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export default function CustomerProfile(props) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    const { authorized, needLogin, itemFound, employee, currentRoleId } =
      props.data;

    if (!authorized) {
      const pageHeader = {
        title: `Not Authorized `,
      };

      return (
        <Fragment>
          <EmployeePageHeader pageHeader={pageHeader} />
        </Fragment>
      );
    }

    if (needLogin) {
      signIn();
    }

    if (!itemFound) {
      const pageHeader = {
        title: `Employee Not Found `,
      };

      return (
        <Fragment>
          <EmployeePageHeader pageHeader={pageHeader} />
          <EmployeeNotFound />
        </Fragment>
      );
    }

    async function actionBtnHandler(action, empid) {

      let alertIcon = "warning";
      let htmlText = `Are you sure you want to <strong>${action.toLowerCase()}</strong> this employee?`;
      const confirmButtonText = `Yes, ${action.toLowerCase()} it!`;
      const cancelButtonText = "No, cancel!";
      let btnColor = "btn btn-warning";

      if (action.toLowerCase() == "remove") {
        alertIcon = "error";
        htmlText = htmlText.concat(
          "<br /><br /> This action cannot be reverted."
        );
        btnColor = "btn btn-danger";
      } else if (action.toLowerCase() == "activate") {
        btnColor = "btn btn-success";
      }

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: btnColor,
          cancelButton: "btn btn-light ms-3",
        },
        buttonsStyling: false,
      });

      const alertResult = await swalWithBootstrapButtons.fire({
        title: `${action} Employee`,
        html: htmlText,
        icon: alertIcon,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        showCancelButton: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
      });

      if (alertResult.isConfirmed) {
        if (
          action.toLowerCase() == "activate" ||
          action.toLowerCase() == "deactivate"
        ) {
          const result = await changeEmployeeStatus({
            newStatus: action.toLowerCase(),
            empEmail: employee.email
          });

          if (result.status == 401) {
            signIn();
          }
      
          if (!result.ok) {
            swalWithBootstrapButtons.fire(
              'Ooops!',
              result.statusText ||
              "Something went wrong! Refresh page and try again.",
              'error'
            )
          } else {
            const response = await result.json();
            const showAlert = await swalWithBootstrapButtons.fire(
              'Done!',
              response.message,
              'success'
            );

            if(showAlert.isConfirmed){
              router.push("/employees/profile/" + empid);
            }
          }


        }else{

          //delete employee

          const result = await deleteEmployee({
            empEmail: employee.email
          });

          if (result.status == 401) {
            signIn();
          }
      
          if (!result.ok) {
            swalWithBootstrapButtons.fire(
              'Ooops!',
              result.statusText ||
              "Something went wrong! Refresh page and try again.",
              'error'
            )
          } else {
            const response = await result.json();
            const showAlert = await swalWithBootstrapButtons.fire(
              'Done!',
              response.message,
              'success'
            );

            if(showAlert.isConfirmed){
              router.push("/employees");
            }
          }
        }

      }
    }

    let statusAction = "Deactivate";
    let btnClassName = "btn-outline-warning";

    if (!employee.active) {
      statusAction = "Activate";
      btnClassName = "btn-outline-success"
    }

    let roleActions = [
      {
        btnTitle: statusAction,
        btnClassName: btnClassName,
        btnAction: actionBtnHandler,
        btnActionId: employee.id,
      },
    ];

    if (currentRoleId == 0 || currentRoleId || 1) {
      roleActions.push({
        btnTitle: "Remove",
        btnClassName: "btn-outline-danger",
        btnAction: actionBtnHandler,
        btnActionId: employee.id,
      });
    }

    const pageHeader = {
      overTitle: "PROFILE FOR: ",
      title: `${employee.firstName} ${employee.lastName}`,
      statusPill: employee.active ? "active" : "inactive",
      buttons: roleActions,
    };

    return (
      <Fragment>
        <EmployeePageHeader pageHeader={pageHeader} />
        <EmployeeProfile item={employee} currentRoleId={currentRoleId} />
      </Fragment>
    );
  } else {
    signIn();
  }
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

  const empid = context.params.empid;
  let authorized = true;
  const currentRoleId = session.user.roleId;

  //validate role
  if (session.user.roleId == 3) {
    authorized = false;
  }

  const response = await getEmployeeById(empid, session.cognitoAccessToken);
  //console.log(response);

  var needLogin = false;
  var item = null;
  var itemFound = false;

  if (response.statusCode == 401) {
    needLogin = true;
  } else {
    item = response.data;
    itemFound = response.fullResponse.itemFound;
  }

  return {
    props: {
      session: session,
      data: {
        authorized: authorized,
        employee: item,
        needLogin: needLogin,
        itemFound: itemFound,
        currentRoleId: currentRoleId,
      },
    },
  };
}
