import { UserDocument } from "../../models/user"
import { IUsersMappedData } from "../../types/admin"

export const usersDataMapping = (user: UserDocument):IUsersMappedData => {
    return {
        _id: user._id.toString(),
        userId: user.Id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        isDeleted: user.isDeleted,
        isOnboardingRequired: user.isOnboardingRequired ?? false,
        role: user.role,
        imageUrl: user?.imageUrl,
        mobileNumber: user?.mobileNumber
    }
}