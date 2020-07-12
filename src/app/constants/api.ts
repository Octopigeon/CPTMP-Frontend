import {environment} from "../../environments/environment";

export const API = {
  login: `${environment.backend}api/login`,
  user_info: `${environment.backend}api/user/me/basic-info`,
  change_password: `${environment.backend}api/user/me/password`,
  upload_avatar: `${environment.backend}api/user/me/avatar`,
}
