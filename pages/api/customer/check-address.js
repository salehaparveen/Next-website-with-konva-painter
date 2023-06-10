import { getSession } from "next-auth/react";

async function handler(req, res) {
    try {
        if (req.method !== "GET") {
          return;
        }
    
        const session = await getSession({ req: req });
    
        if (!session) {
          res.status(401).json({ message: "Not Authenticated." });
          return;
        }
    
        const authToken = session.cognitoAccessToken;
        const addressString = req.query.addressString;
    
        const url = `${process.env.AWSAPIURL}/customer/check/address/${addressString}`;
    
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        });
    
        if (response.status == 401) {
          res.status(401).json({ message: "Not Authenticated." });
          return;
        }
    
        const respondObj = await response.json();
        //console.log(respondObj);
    
        if (!respondObj.success) {
          res.status(422).json({ ...respondObj });
          return;
        }
    
        res.status(201).json({ ...respondObj });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
        return;
      }
}

export default handler;