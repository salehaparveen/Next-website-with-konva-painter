import { Fragment, useEffect, useState } from "react";

import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { getEstimateId } from "../../../utils/functions";
import DrawingCanvas from "../../../components/canvas/drawing-canvas";
import Link from "next/link";
import { useRouter } from "next/router";

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

function EstimateById(props) {
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

  async function canvasSaveBtnHandler(value) {
    //console.log("canvas value from estimate-form component: ", value);
    setdrawingSavedMsg("Loading, Please wait!...");
    const result = await saveEstimateDrawing({
      existingEstimateNumber: estimateInformation.estimateNumber,
      estimateTableId: estimateInformation.id,
      drawingData: value,
    });

    if (result.ok) {
      const response = await result.json();
      setdrawingSavedMsg(response.message);
    } else {
      setdrawingSavedMsg(
        result.statusText || "Something went wrong! Refresh page and try again."
      );
    }
  }

  return (
    <Fragment>
        <div className="row sticky-top bg-black p-3 rounded-bottom" style={{marginTop: "-20px"}}>
          <div className="col-auto me-auto">
            <Link href={backURL} className="btn btn-light btn-sm">
              Back to Estimate Information
            </Link>
          </div>
        </div>

      <div className="row mt-3">
        <div className="col">
          <h5>Estimate Number: {estimateInformation.estimateNumber}</h5>
          <hr />
        </div>
      </div>

      {drawingSavedMsg && (
        <div className="custom-alert-canvas">{drawingSavedMsg}</div>
      )}

      <DrawingCanvas
        saveBtnHandler={canvasSaveBtnHandler}
        drawingData={estimateInformation.currentDrawing}
      />
    </Fragment>
  );
}

export default EstimateById;

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

  const estimateInformation = {
    currentDrawing: (data.data.estimateInfo.drawing) ? data.data.estimateInfo.drawing : '',
    estimateNumber: data.data.estimateInfo.estimateNumber,
    id: data.data.estimateInfo.id,
  };

  //console.log(estimateInformation);

  return {
    props: {
      session: session,
      estimateInformation: estimateInformation,
    },
  };
}
