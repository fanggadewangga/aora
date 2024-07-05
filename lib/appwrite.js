import { Account, Client, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fangga.aora',
    projectId: '66873c99003276296a0c',
    databaseId: '66873dbf00091beed2b6',
    userCollectionId: '66873dd40022d569a532',
    videoCollectionId: '66873df9001a62c91c08',
    storageId: '66873fcb0020c58db2b9'
}


const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const createUser = () => {
    const account = new Account(client);

    // Register User
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
        .then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
}