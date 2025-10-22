import api from "./axios";

export const getAdminsRequest = async () => api.get(`/user/admins`);

export const getSpeakersRequest = async () => api.get(`/user/speakers`);

export const getCaregiversRequest = async () => api.get(`/user/caregivers`);
