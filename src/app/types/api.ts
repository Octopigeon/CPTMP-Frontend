import {environment} from "../../environments/environment";

export const API = {
  login: `${environment.backend}api/login`,
  user_info: `${environment.backend}api/user/me/basic-info`,
}
