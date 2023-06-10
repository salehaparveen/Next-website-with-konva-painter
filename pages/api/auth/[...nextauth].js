import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

async function refreshAccessToken(token) {
  try {
    const url = `${process.env.AWSAPIURL}/user/refreshToken`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        userRefreshToken: token.cognitoRefreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newExpDate = Date.now() + refreshedTokens.expiresIn * 1000;

    // console.log(
    //   "Token Refreshed! New Expiration Date: ",
    //   new Date(newExpDate).toLocaleString("en-US", {
    //     timeZone: "America/New_York",
    //   })
    // );

    return {
      ...token,
      cognitoTokenExpirationDate: newExpDate,
      cognitoRefreshToken:
        refreshedTokens.refreshToken ?? token.cognitoRefreshToken, // Fall back to old refresh token
      cognitoAccessToken: refreshedTokens.newToken,
    };
  } catch (error) {
    //console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const url = `${process.env.AWSAPIURL}/user/login`;

        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            oldPassword: credentials.password,
            newPassword: credentials.newPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const user = await response.json();

        if (!user.success) {
          throw new Error(user.message);
        }

        return { user: user };
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {

        const tokenExpDate =
          Date.now() + user.user.cognitoExpirationDate * 1000;

        // console.log(
        //   "cognito token expiration date: ",
        //   new Date(tokenExpDate).toLocaleString("en-US", {
        //     timeZone: "America/New_York",
        //   })
        // );

        return {
          cognitoAccessToken: user.user.token,
          cognitoRefreshToken: user.user.cognitoRefreshToken,
          cognitoExpirationTime: user.user.cognitoExpirationDate,
          cognitoTokenExpirationDate: tokenExpDate,
          cognitoEmail: user.user.email,
          userFirstName: user.user.firstName,
          userLastName: user.user.lastName,
          userRoleId: user.user.roleId,
          userRoleDescription: user.user.roleDescription,
        };
      }

      const currentDate = new Date(Date.now()).toLocaleString("en-US", {
        timeZone: "America/New_York",
      });

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.cognitoTokenExpirationDate) {
        // console.log(
        //   "cognito token expiration date: ",
        //   new Date(token.cognitoTokenExpirationDate).toLocaleString("en-US", {
        //     timeZone: "America/New_York",
        //   })
        // );
        return token;
      }

      // console.log(
      //   "Token Expired... Date: ",
      //   new Date(token.cognitoTokenExpirationDate).toLocaleString("en-US", {
      //     timeZone: "America/New_York",
      //   })
      // );

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      session.cognitoAccessToken = token.cognitoAccessToken;
      session.cognitoRefreshToken = token.cognitoRefreshToken;
      session.cognitoExpirationTime = token.cognitoExpirationTime;

      session.user.email = token.cognitoEmail;
      session.user.firstName = token.userFirstName;
      session.user.lastName = token.userLastName;
      session.user.roleId = token.userRoleId;
      session.user.roleDescription = token.userRoleDescription;
//console.log(session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 3600, //1 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true
};

export default NextAuth(authOptions);
