import {environment} from "../../environments/environment";

export const API = {
  login: `${environment.backend}api/login`,
  user_info: `${environment.backend}api/user/me/basic-info`,
  change_password: `${environment.backend}api/user/me/password`,
  upload_avatar: `${environment.backend}api/user/me/avatar`,
  delete_user: `${environment.backend}api/user`,
  delete_project: `${environment.backend}api/train-project`,
  org: `${environment.backend}api/org`,
  org_basic_info: `${environment.backend}api/org/basic-info`,
  train: `${environment.backend}api/train`,
}
