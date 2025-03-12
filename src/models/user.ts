export interface User {
    user_metadata: UserMetadata
    email: string
}

export interface UserMetadata {
    avatar_url: string
    full_name: string
    name: string
}