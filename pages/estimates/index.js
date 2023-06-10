import Link from "next/link";
import { Fragment, useState, useEffect} from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { getAllEstimates } from "../../utils/functions";
import DisplayEstimates from "../../components/estimates/displayestimates";


function AllEstimates(props) {

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


  return (
    <Fragment>
      <Link href="/estimates/new" className="btn btn-success btn-sm">
        New Estimate
      </Link>
      <hr />
      <DisplayEstimates data={props.estimatesData} />
    </Fragment>
  );
}

export default AllEstimates;

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

  const estimatesData = await getAllEstimates(session.cognitoAccessToken);

  var needLogin = false;
  var items = null;
  let itemCount = 0;

  if (estimatesData.statusCode == 401) {
    needLogin = true;
  }else{
    items = estimatesData.data;
    itemCount = estimatesData.fullResponse.itemCount;
  }

  //console.log(items);

  return {
    props: {
      session: session,
      estimatesData: items,
      itemCount: itemCount,
      needLogin: needLogin,
    },
  };
}

