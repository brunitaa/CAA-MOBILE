import api from "../api/axios";

// Registro de caregiver
export const registerCaregiverRequest = async (user) =>
  api.post("/register-caregiver", user);

// Login caregiver
export const loginCaregiverRequest = async (user) =>
  api.post("/auth/caregiver/login", user);

// Verificar OTP
export const verifyOTPRequest = async (user) =>
  api.post("/verify-otp-caregiver", user);

// Reenviar OTP
export const resendOTPRequest = async (user) => api.post("/resend-otp", user);

// Solicitar token para reset de contraseña
export const requestPasswordTokenRequest = async (user) =>
  api.post("/request-password-token", user);

// Reset de contraseña
export const changePasswordRequest = async (user) =>
  api.post("/reset-password-token", user);

// Obtener perfil
export const getProfileRequest = async () => api.get("/auth/profile");

// Validar token
export const verifyTokenRequest = async () => api.get("/auth/validate");

// Logout
export const logoutRequest = async () => api.post("/auth/logout");

export const getSpeakersRequest = (token) => {
  return api.get("/speaker/my-speakers", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
