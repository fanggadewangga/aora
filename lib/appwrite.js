import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fangga.aora',
    projectId: '66873c99003276296a0c',
    databaseId: '66873dbf00091beed2b6',
    userCollectionId: '66873dd40022d569a532',
    videoCollectionId: '66873df9001a62c91c08',
    storageId: '66873fcb0020c58db2b9'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = appwriteConfig;


const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        )

        if (!newAccount) {
            throw Error;
        }

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

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

        return newUser
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) {
            throw Error;
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', currentAccount.$id)
            ]
        )

        if (!createUser) {
            throw Error;
        }

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllVideos = async () => {
    try {
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getTrendingVideos = async () => {
    try {
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const searchVideos = async (query) => {
    try {
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserVideos = async (userId) => {
    try {
        const videos = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )
        return videos.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl
    
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(
                storageId,
                fileId
            )
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                'top',
                100
            )
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) {
            throw new Error;
        }

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if (!file) {
        return
    }

    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri : file.uri,
     }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newVideo = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newVideo
    } catch (error) {
        throw new Error(error)
    }
}