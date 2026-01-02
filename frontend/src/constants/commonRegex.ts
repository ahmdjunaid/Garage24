export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
export const nameRegex = /^(?=.{3,25}$)[A-Za-z]{3,}(?: [A-Za-z]+)*$/;
export const otpRegex = /^\d{6}$/;
export const mobileRegex = /^[6-9]\d{9}$/;
export const serviceNameRegex = /^(?=(?:.*[A-Za-z]){4,})[A-Za-z0-9 -]{6,}$/;