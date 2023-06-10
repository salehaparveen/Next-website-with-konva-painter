
import { Fragment } from "react";
import EmployeeForm from "../../components/employees/employeeform";
import EmployeePageHeader from "../../components/employees/page-header";
import { getSession, useSession, signIn } from "next-auth/react";

export default function AddNewEmployee() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    const pageHeader = {
      title: "New Employee",
      action: [],
    };
    return (
      <Fragment>
        <EmployeePageHeader pageHeader={pageHeader} />
        <EmployeeForm />
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

  return {
    props: { session },
  };
}