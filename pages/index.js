import { getSession, signIn, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import GraphEstimateByDay from "../components/dashboard/estimates-by-day";
import { getEstimatesLast7Days } from "../utils/functions";

function HomePage() {
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
  //https://itnext.io/chartjs-tutorial-with-react-nextjs-with-examples-2f514fdc130
  return (
    <Fragment>
      <GraphEstimateByDay />
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

  // const estimatesByDay = await getEstimatesLast7Days(session.cognitoAccessToken);
  // console.log(estimatesByDay);
  return {
    props: { session },
  };
}

export default HomePage;
