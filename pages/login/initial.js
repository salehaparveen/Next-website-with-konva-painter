import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import LoginForm from "../../components/login/login-form";

export default function FirstTimeLogin(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  //if you are login, no need to show this page.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <LoginForm firstTime={true} email={props.email} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const emailReceived = context.query.email;

  if (!emailReceived) {
    return {
        notFound: true,
      };
  }

  return {
    props: {
      email: emailReceived,
      session: session,
    },
  };
}
