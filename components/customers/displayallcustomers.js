import { signIn, useSession } from "next-auth/react";
import { Fragment } from "react";
import CustomerList from "./customer-list";
import CustomerNewSection from "./customer-new-section";

function DisplayAllCustomers(props) {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    const { customers } = props;
    //console.log("displayallcustomers components props:", customers);

    return (
      <Fragment>
        <div className="container">
          <CustomerNewSection />
          <CustomerList items={customers} />
        </div>
      </Fragment>
    );
  } else {
    signIn();
  }
}

export default DisplayAllCustomers;
