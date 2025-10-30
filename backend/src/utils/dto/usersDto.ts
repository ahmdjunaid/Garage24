import { IUsersMappedData } from "../../types/admin"

export const usersDataMapping = (user:any):IUsersMappedData => {
    return {
        _id: user._id,
        userId: user.Id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        isDeleted: user.isDeleted,
        isOnboardingRequired: user.isOnboardingRequired,
        role: user.role,
        imageUrl: user?.imageUrl,
        mobileNumber: user?.mobileNumber
    }
}