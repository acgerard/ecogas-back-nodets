declare namespace Express {
    export interface Request {
        userId?: number
        profile?: UserProfile
    }
}

enum UserProfile {
    ADMIN= 'ADMIN',
    STATION = 'STATION',
    CUSTOMER = 'CUSTOMER'
}
