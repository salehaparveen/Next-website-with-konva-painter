import { getSession } from "next-auth/react";

async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return;
    }

    const session = await getSession({ req: req });

    if (!session) {
      res.status(401).json({ message: "Not Authenticated." });
      return;
    }

    const authToken = session.cognitoAccessToken;
    const bodyData = req.body;

    const url = `${process.env.AWSAPIURL}/employee/delete`;

    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(bodyData),
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
