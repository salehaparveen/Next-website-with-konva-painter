import { Fragment } from "react";
import NewCustomerForm from "../../components/customers/newcustomerform";
import { getSession, signIn, useSession } from "next-auth/react";

function NewCustomer() {

  const { status } = useSession();

  if(status === 'unauthenticated'){
    signIn();
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-auto me-auto d-flex align-items-center">
            <h4 className="mb-0">Add New Customer</h4>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <hr />
            <p className="text-muted">
              Fill out the following form and click submit.
            </p>
          </div>
        </div>
        <NewCustomerForm />
      </div>
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

  return {
    props: { session },
  };
}

export default NewCustomer;
