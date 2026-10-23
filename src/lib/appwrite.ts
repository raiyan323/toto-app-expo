import { Client } from "react-native-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6ad96918002dec55b513");

export { client };
