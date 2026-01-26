export const SERVER_ERROR = "Internal server error.";

//User messages
export const USER_NOT_FOUND = "Account doesn't found";
export const USER_ID_REQUIRED = "User ID is required";
export const USER_STATUS_UPDATE_FAILED = "Failed to update user status";
export const USER_STATUS_CHANGED = "User status changed successfully";
export const USER_ALREADY_EXISTS = "User already exists";
export const REGISTRATION_ALREADY_INITATED = "Your account registration is already in progress. Please try again later.";
export const ACCOUNT_IS_BLOCKED = "This account is blocked by Admin.";
export const SIGNUP_SESSION_EXPIRED = "Signup session expired"
export const LOGGED_OUT_MESSAGE = "Logged out successfully."
export const PROFILE_FIELDS_EMPTY = "Update request must include at least one field to modify."

//Email
export const INVALID_EMAIL = 'Invalid email address'
export const EMAIL_NOT_VERIFIED = "Email not verified. Please verify your OTP.";

//authentication
export const ALL_FIELDS_REQUIRED="All fields are required"
export const PASSWORD_REQUIRED = "Password is required for this action";
export const INVALID_CREDENTIALS = "Invalid credentials";
export const INVALID_OTP = "Invalid OTP";
export const OTP_EXPIRED = "OTP has expired";
export const OTP_VERIFIED_SUCCESSFULLY = "OTP verified successfully";
export const OTP_RESENT_SUCCESSFULLY = "User OTP resent successfully";
export const OTP_SENT_SUCCESSFULLY = "User OTP sent successfully";
export const INVALID_OTP_EXPIRATION = "OTP expiration time is invalid";
export const ERROR_WHILE_FORGOT_PASS='Password reset failed'
export const ERROR_WHILE_RESEND_OTP='Error while resend OTP.'
export const FORGOT_PASSWORD_EMAIL_SENT =
"Email sent successfully for forgot password";
export const PASSWORD_RESET_SUCCESSFULLY = "Password reset successful. Please login with your new credentials.";
export const NO_REFRESH_TOKEN_FOUND = "No refresh token found";
export const INVALID_TOKEN = "Invalid token";
export const GOOGLE_AUTH_ERROR="Error while google authentication"
export const PASSWORD_NOT_SET = "This account doesn’t have a password set. You may have signed up using Google login."
export const PASSWORD_CHANGED_SUCCESS = "Your password has been changed successfully."
export const AUTHENTICATION_FAILED = "Your session has expired. Please log in again."

// plan messages
export const PLAN_NOT_FOUND = "Plan not found!"
export const ERROR_WHILE_CREATINGPLAN = "Error while creating plan."
export const PLAN_ALREADY_EXIST = "Plan with this name already exists."
export const PLAN_CREATED_SUCCESS = "Plan created successfully."
export const ERROR_WHILE_PLAN_UPDATE="An error occured while update status."
export const RENEWAL_POLICY_VIOLATION = "You can renew your plan only within 7 days of expiry, and only for the same plan."
export const SUB_LIMIT_EXCEEDED = "You can have a maximum of two active subscriptions."

//garage messages
export const GARAGE_APPROVAL_FAILED = "Error while approval/rejection"
export const GARAGE_NOT_FOUND = "Garage not found!"

//mechanic
export const EMAIL_ALREADY_EXIST = "Email already exist, Try with another email!"
export const INVALID_INPUT = "Invalid input!"


//payment
export const WEBHOOK_ERROR="Stripe-Signature header is missing"
export const SUBSCRIPTION_ERROR="Error while subscribe plan, try agian."
export const PAYMENT_DETAILS_ERROR="Error while retriving payment details, try agian."

//Common
export const ERROR_WHILE_FETCH_DATA = "Error while fetching data."

//services
export const SERVICE_ALREADY_EXIST="Service already exist"
export const SERVICE_CREATED_SUCCESS="Service created successful."
export const SERVICE_DOESNT_EXIST="Service does't exist."

//vehicle
export const VEHICLE_ALREADY_EXIST="Vehicle already exist in your Garage."
export const ERROR_WHILE_CREATING_VEHICLE="Error while creating vehicle"
export const VEHICLE_CREATED_SUCCESS="Vehicle created successful"

// location
export const POINTS_MISSING = "Latitude and Longitude cannot be blank."