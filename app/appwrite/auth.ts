import { OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, dataBase } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(OAuthProvider.Google);
  } catch (e) {
    console.log("loginWithGoogle", e);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await dataBase.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollection,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "accountId", "imageUrl", "status"]),
      ]
    );
  } catch (e) {
    console.log(e);
  }
};

export const logoutUser = async () => {
  try {
  } catch (e) {
    console.log(e);
  }
};

export const getGoglePicture = async () => {
  try {
    const session = await account.getSession("current");

    const OAuthToken = session.providerAccessToken;
    if (!OAuthToken) {
      console.log("no OAuth token available");
      return null;
    }

    const response = await fetch(
      "http://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${OAuthToken}`,
        },
      }
    );
    if (!response.ok) {
      console.log("failed to fetch profile photo from google people api");
    }

    const data = await response.json();
    const photoUrl = data.photos && data.photos.length > 0;
  } catch (e) {
    console.log(e);
  }
};

export const storeUserData = async () => {
  try {
  } catch (e) {
    console.log(e);
  }
};

export const getExistingUser = async () => {
  try {
  } catch (e) {
    console.log(e);
  }
};
