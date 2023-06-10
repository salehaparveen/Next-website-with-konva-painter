import { Fragment, useEffect, useMemo, useState } from "react";
import DisplayAllCustomers from "../../components/customers/displayallcustomers";
import { getSession, signIn, useSession } from "next-auth/react";
import { allCustomers } from "../../utils/functions";
import DataTable from "react-data-table-component";
import { formatPhoneNumber } from "../../utils/functions";
import CustomerNewSection from "../../components/customers/customer-new-section";
import DisplayCustomers from "../../components/customers/displaycustomers";



function AllCustomers(props) {
  const { data: session, status } = useSession();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
    setHydrated(true)
  }, [session]);

  if(!hydrated){
    return null;
  }
  

  if (status === "authenticated") {
    

    const { customers } = props;
   
      return (
        <Fragment>
          <CustomerNewSection />
          <hr />

          {(customers.length > 0) ? (
            <DisplayCustomers customers={customers} />
          ) : (
            <div>
              <p>There are no customers yet.</p>
            </div>
          )}
          
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

  const customers = await allCustomers(session.cognitoAccessToken);
  var needLogin = false;
  var items = null;

  if (customers.statusCode == 401) {
    needLogin = true;
  } else {
    items = customers.data;
  }
  //console.log(items);
  return {
    props: {
      session: session,
      customers: items,
      needLogin: needLogin,
    },
  };
}

export default AllCustomers;
