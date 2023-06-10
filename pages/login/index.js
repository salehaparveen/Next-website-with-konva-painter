import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

import LoginForm from "../../components/login/login-form";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  //const [calledPush, setCalledPush] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();
  

  //let redirectURL = "/";
  
  useEffect(() => {

    if (status === "authenticated") {
      router.replace("/");
    }else{
      setIsLoading(false);
    }
    // getSession().then((session) => {
    //   if (session) {

    //     // console.log("calledPush: ", calledPush);
        
    //     // if (!calledPush) {
    //     //   setCalledPush(true);
    //     //   console.log("setting calledPush to: ", calledPush);
          
    //     // }
    //     router.replace("/");
    //   } else {
    //     setIsLoading(false);
    //   }
    // });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <LoginForm />
    </Fragment>
  );
}

export default LoginPage;

// export async function getServerSideProps(context) {
//   const referralURL = context.req.headers.referer;

//   console.log("referralURL: ", referralURL);
//   console.log("context.req.headers: ", context.req.headers);

//   return {
//     props: {
//       referralURL: referralURL ? referralURL : "",
//     },
//   };
// }
