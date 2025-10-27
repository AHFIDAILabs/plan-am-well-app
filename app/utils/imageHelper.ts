import { User } from '../types/UserType';

// Helper function to normalize the user object structure
export const normalizeUser = (user: any): User => {
    let finalAvatarUrl: string | null = null;
    const avatar = user.avatar;

    // Check if avatar is a non-null object
    if (typeof avatar === 'object' && avatar !== null) {
        // Step 1: Extract the URL from the object. This will be a string or null.
        const extractedUrl = avatar.url;

        // Step 2: Only assign if the extracted URL is a truthy value (i.e., not null, not "", not 0, etc.)
        if (extractedUrl) {
            finalAvatarUrl = extractedUrl;
        }
        
    } else if (typeof avatar === 'string' && avatar) {
        // Handle case where it might already be a string URL (e.g., from editProfile response)
        finalAvatarUrl = avatar;
    }
    
    // The finalavatarUrl is guaranteed to be a string URL or null.
    // If avatar was {"url": null}, it is now null.
    // If avatar was an empty string, it is now null.

    // Return the user object with the normalized avatar property
    return {
        ...user,
        avatar: finalAvatarUrl, // This is guaranteed to be a string URL or null
    } as User; // Cast to your User type
};