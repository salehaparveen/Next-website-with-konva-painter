
import { Fragment, useEffect } from "react";
import { allCustomers } from "../../utils/functions";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import EstimateForm from "../../components/estimates/new-estimate-form";


function NewEstimate(props) {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    signIn();
  }

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  const { customers } = props;

  return (
    <Fragment>
      <EstimateForm customers={customers} />
    </Fragment>
  );
}

export default NewEstimate;

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

  const customers = await allCustomers(session.cognitoAccessToken);

  var items = null;

  items = customers.data;

  return {
    props: {
      session: session,
      customers: items,
    },
  };
}
