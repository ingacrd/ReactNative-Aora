
import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, Query } from 'react-native-appwrite';
import { ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform:'com.aru.aora',
    projectId: '66abce96003a3b5dfd9f',
    databaseId: '66abd196001e74cc47d7',
    userCollectionId: '66abd1cb0026735be294',
    videoCollectionId: '66abd259002550483f27',
    storageId: '66abd4380000b78667d4'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(), 
            email,
            password,
            username
        )

        
        if(!newAccount) throw Error;
        //console.log(newAccount);

        const avatarUrl = avatars.getInitials()

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        
        )
        return newUser;

    }catch(error){
        console.log(error);
        throw new Error(error);
    }

    // Register User
    // account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    //     .then(function (response) {
    //         console.log(response);
    //     }, function (error) {
    //         console.log(error);
    //     });
}

export const signIn = async(email, password) => {
    try{
        const session = await account.createEmailPasswordSession(
            email,
            password
        )

        return session;

    }catch(error){
        throw new Error(error)
    }
}

export const getCurrentUser = async() => {
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async() => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}

export const getLatestPost = async() => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}

export const searchPost = async(query) => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}
export const getUserPost = async(userId) => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('users', userId)]
        )
        return posts.documents;
    }catch(error){
        throw new Error(error);
    }
}

export const signOut = async () => {
    try{
        const session = await account.deleteSession('current');
        return session;
    }catch(error) {
        throw new Error(error)
    }
}