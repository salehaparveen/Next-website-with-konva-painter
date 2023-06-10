import { getSession, signOut } from "next-auth/react";
import { customerById } from "../../utils/functions";
import ExistingCustomerForm from "../../components/customer-detail/customer-detail-form";
import { Fragment } from "react";

function CustomerById(props) {
  const { needLogin, customer, itemFound } = props;

  if (needLogin) {
    signOut();
    return;
  }

  return (
    <Fragment>
      <ExistingCustomerForm item={customer} itemFound={itemFound}  />
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

  if (customer.statusCode == 401) {
    needLogin = true;
  } else {
    item = customer.data;
    itemFound = customer.fullResponse.itemFound;
  }

  return {
    props: {
      session: session,
      customer: item,
      needLogin: needLogin,
      itemFound: itemFound
    },
  };
}

export default CustomerById;
