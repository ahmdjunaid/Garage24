import api from "../../../../services/api";
import { MECHANIC_BASE_ROUTE } from "../../../../constants/apiRoutes";

export const onboardingMechanicApi = (data: FormData) => {
  return api
    .post(`/${MECHANIC_BASE_ROUTE}/onboarding`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};