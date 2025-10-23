import { IMechanicMappedData } from "../../types/mechanic";

export const mechanicDataMapping = (mechanics:any):IMechanicMappedData => {
    const userDetails = mechanics.userId;
    return {
        userId: userDetails._id,
        mechanicId: userDetails.Id,
        name: userDetails.name,
        email: userDetails.email,
        isBlocked: userDetails.isBlocked,
        isVerified: userDetails.isVerified,
        isOnboardingRequired: userDetails.isOnboardingRequired,
        role: userDetails.role,
        skills: mechanics?.skills,
        imageUrl: mechanics?.imageUrl,
        mobileNumber: mechanics?.mobileNumber
    }
}