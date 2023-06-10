import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { customerById, getEstimatesByCustId } from "../../../utils/functions";
import { Fragment, useEffect, useState } from "react";
import ProfilePageTitle from "../../../components/customer-profile/profile-title";
import ProfileCustomerInfo from "../../../components/customer-profile/profile-customer-info";
import ProfileCustomerEstimates from "../../../components/customer-profile/profile-customer-estimates";
import CustomerDetailNotFound from "../../../components/customer-detail/customer-detail-notfound";

export default function CustomerProfile(props) {

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


  const { needLogin, customer, itemFound, estimates, estimatesCount } = props;

  if (!itemFound) {
    return (
      <Fragment>
        <CustomerDetailNotFound />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ProfilePageTitle id={customer.id} count={estimatesCount} />
      <ProfileCustomerInfo item={customer} />
      <ProfileCustomerEstimates count={estimatesCount} items={estimates} />
    </Fragment>
  );
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

  const cid = context.params.cid;
  const customer = await customerById(cid, session.cognitoAccessToken);

  var needLogin = false;
  var item = null;
  var itemFound = false;
  var estimatesItems = null;
  var estimatesCount = 0;

  if (customer.statusCode == 401) {
    needLogin = true;
  } else {
    item = customer.data;
    itemFound = customer.fullResponse.itemFound;
  }

  const estimates = await getEstimatesByCustId(cid, session.cognitoAccessToken);

  //console.log(estimates);

  if (estimates.statusCode == 401) {
    needLogin = true;
  } else {
    estimatesItems = estimates.data;
    estimatesCount = estimates.fullResponse.count;
  }

  return {
    props: {
      session: session,
      customer: item,
      needLogin: needLogin,
      itemFound: itemFound,
      estimates: estimatesItems,
      estimatesCount: estimatesCount,
    },
  };
}
