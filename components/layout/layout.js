import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./sidebar";
import Head from "next/head";

function Layout(props) {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  if (status === "authenticated") {
    return (
      <Fragment>
        <Head>
          <title>PFMS: Property Fence Management System</title>
        </Head>
        <Sidebar
          session={session}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        <div
          className={
            isExpanded ? "content-right-side-full" : "content-right-side-short"
          }
        >
          <main className="main-container">{props.children}</main>
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Head>
          <title>PFMS: Property Fence Management System</title>
        </Head>
        <main>{props.children}</main>
      </Fragment>
    );
  }
}

export default Layout;
