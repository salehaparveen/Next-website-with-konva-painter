import { getSession, useSession, signIn } from "next-auth/react";
import { Fragment, useState, useEffect } from "react";
import DisplayAllEmployees from "../../components/employees/displayallemployees";
import { getAllEmployees } from "../../utils/functions";

export default function PFMSEmployees(props) {
  const { data: session, status } = useSession();
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

  const { employees } = props;
  return (
      <Fragment>
        <DisplayAllEmployees employees={employees} />
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

  const employees = await getAllEmployees(session.cognitoAccessToken);
  // var needLogin = false;
  var items = null;

  //console.log("employees: ", employees);

  if (employees.statusCode !== 401) {
    items = employees.data;
  }

  return {
    props: {
      session: session,
      employees: items,
      // needLogin: needLogin,
    },
  };
}
