import { IUsersMappedData } from "../../types/admin"
import { IUser } from "../../types/user"

export const usersDataMapping = (user: IUser):IUsersMappedData => {
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