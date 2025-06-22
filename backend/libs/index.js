import ActivityLog from "../models/activity.modal.js";



const recordActivity = async (
    userId,
    action,
    resourceType,
    resourceId,
    details
) => {
    try {
        await ActivityLog.create({
            user:userId,
            action,
            resourceType,
            resourceId,
            details
        })
    } catch (error) {
        console.log("Activity: ",error);
    }
}

export { recordActivity }