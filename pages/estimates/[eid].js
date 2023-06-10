import { Fragment, useEffect, useState } from "react";
import { getEstimateId } from "../../utils/functions";
import { getSession, signIn, useSession } from "next-auth/react";
import ExistingEstimateForm from "../../components/estimates/estimate-form";

function EstimateById(props) {
  const {data:session, status } = useSession();
  const [hydrated, setHydrated] = useState(false);

  if (status === "unauthenticated") {
    signIn();
  }

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
    setHydrated(true)
  }, [session]);

  if(!hydrated){
    return null;
  }

  const { estimateData, customerData } = props;

  return (
    <Fragment>
      <ExistingEstimateForm
        estimateData={estimateData}
        customerData={customerData}
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

  //console.log(data);
  let estimateInfo,
    customerInfo = null;

  estimateInfo = data.data.estimateInfo;
  customerInfo = data.data.customerInfo;

  return {
    props: {
      session: session,
      estimateData: estimateInfo,
      customerData: customerInfo,
    },
  };
}
