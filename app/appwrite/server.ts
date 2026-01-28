export const runtime = "nodejs";

import { Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API,
  databaseId: import.meta.env.VITE_DATABASE_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION,
  tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION,
};

const serverCLient = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId)
  .setDevKey(appwriteConfig.apiKey);

export const serverDatabase = new Databases(serverCLient);
export const serverStorage = new Storage(serverCLient);
