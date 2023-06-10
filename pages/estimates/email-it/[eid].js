import { Fragment, useEffect, useState } from "react";

import { getSession, signIn, useSession } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/router";
import { getEstimateId } from "../../../utils/functions";
import EmailAttachements from "../../../components/email-estimate/attachements";

async function saveEstimateDrawing(data) {
  const response = await fetch("/api/estimate/update-drawing", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

function SendEstimateOverEmail(props) {
  const { data: session, status } = useSession();
  const [hydrated, setHydrated] = useState(false);
  const [drawingSavedMsg, setdrawingSavedMsg] = useState();

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setdrawingSavedMsg("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [drawingSavedMsg]);

  if (status === "unauthenticated") {
    signIn();
  }

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
    setHydrated(true);
  }, [session]);

  if (!hydrated) {
    return null;
  }

  const { estimateInformation } = props;
  // const pdfURL = `${process.env.AWSRESTAPIURL}/generatePDF/${estimateInformation.id}:${estimateInformation.estimateNumber}`;
  const backURL = `/estimates/${estimateInformation.id}:${estimateInformation.estimateNumber}`;

  //send PDF over Email
  async function sendPDFOverEmail() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-info ms-3",
        cancelButton: "btn btn-light ms-3",
      },
      buttonsStyling: false,
    });

    const askToConfirm = await swalWithBootstrapButtons.fire({
      title: "Send PDF over Email",
      html: "Are you sure you want to <strong>SEND</strong> this estimate over email? Before continuing, make sure you hit the 'SAVE' button. ",
      icon: "info",
      confirmButtonText: "Yes, Send it!",
      cancelButtonText: "No, Cancel",
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
    });

    if (askToConfirm.isConfirmed) {
      setRequestStatus("pending");

      const result = await emailPDFRequest({
        estimateId: estimateData.id,
        estimateNumber: estimateData.estimateNumber,
        customerEmail: customerData.email,
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
        setRequestStatus(null);

        if (showAlert.isConfirmed) {
          router.push(currentURL);
        }
      }
    }
  }

  return (
    <Fragment>
      <div className="container">
        <div
          className="row sticky-top bg-black p-3 rounded-bottom"
          style={{ marginTop: "-20px" }}
        >
          <div className="col-auto me-auto">
            <Link href={backURL} className="btn btn-light btn-sm">
              Back to Estimate Information
            </Link>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <h5>
              Estimate Number: {estimateInformation.estimateNumber} - Send it
              over email
            </h5>
            <hr />
          </div>
        </div>

        <div className="row">
        </div>
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <EmailAttachements />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SendEstimateOverEmail;

export async function getServerSideProps(context) {
  const estimateId = context.params.eid;

  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const data = await getEstimateId(estimateId, session.cognitoAccessToken);

  //console.log(data);

  const estimateInformation = {
    additionalCopies: data.data.estimateInfo.additionalCopies
      ? data.data.estimateInfo.additionalCopies
      : "",
    estimateNumber: data.data.estimateInfo.estimateNumber,
    id: data.data.estimateInfo.id,
    relatedEstimateId: data.data.estimateInfo.relatedEstimateId
      ? data.data.estimateInfo.relatedEstimateId
      : "",
    relatedEstimateNumber: data.data.estimateInfo.relatedEstimateNumber
      ? data.data.estimateInfo.relatedEstimateNumber
      : "",
  };

  console.log(estimateInformation);

  return {
    props: {
      session: session,
      estimateInformation: estimateInformation,
    },
  };
}
