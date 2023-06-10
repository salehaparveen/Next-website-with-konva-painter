import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Edit, FileText, X, ArrowLeft } from "react-feather";
import Swal from "sweetalert2";

async function deleteCustomer(body) {
  const response = await fetch("/api/customer/delete", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export default function ProfilePageTitle(props) {
  const { id, count } = props;
  const editProfileLink = `/customers/${id}`;
  const newEstimateLink = `/estimates/new/${id}`;
  const router = useRouter();

  const iconSize = 16;
  const btnDisabledClass =
    count == 0
      ? "btn btn-outline-danger btn-sm"
      : "btn btn-outline-danger btn-sm disabled";

  async function removeBtnHandler() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    const alertResult = await swalWithBootstrapButtons.fire({
      title: "Delete Customer",
      html: "Are you sure you want to delete this customer? This action cannot be reverted.",
      icon: "warning",
      confirmButtonText: "Yes, Delete Customer!",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if (alertResult.isConfirmed) {
      const result = await deleteCustomer({
        customerId: id,
      });

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
          router.push("/customers");
        }
      }
    }
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col mt-3">
          <div className="row">
            <div className="col-auto me-auto d-flex align-items-center align-middle">
              <h3 className="mb-0">Customer Profile</h3>
            </div>
            <div className="col-auto">
              <Link
                href="/customers"
                className="btn btn-outline-secondary me-2 btn-sm"
              >
                <ArrowLeft size={iconSize} className="me-1" />
                Back
              </Link>
              <Link
                href={editProfileLink}
                className="btn btn-warning me-2 btn-sm"
              >
                <Edit size={iconSize} className="me-1" />
                Edit Profile
              </Link>
              {/* <Link
                href={newEstimateLink}
                className="btn btn-success me-2 btn-sm"
              >
                <FileText size={iconSize} className="me-1" />
                New Estimate
              </Link> */}
              <button
                onClick={(e) => removeBtnHandler()}
                className={btnDisabledClass}
              >
                <X size={iconSize} className="me-1" />
                Delete Customer
              </button>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </Fragment>
  );
}
