export interface LoginQ {
  username: string;
  password: string;
}

export interface LoginP {
  status_code: number;
  date: number | string;
  msg: string;
}

export interface UserInfo {
  name: string;
  role: string;
  avatar: string;
}

export interface UserInfoL {
  login: boolean;
  info?: UserInfo;
}



export interface RegisterQ {
  name: string;
  password: string;
  invitation_code: string;
}

export interface RegisterP {
  status_code: number;
  id?: string;
  user_info?: UserInfo;
}

export interface ModifyPasswordQ {
  id: string;
  old_password: string;
  new_password: string;
}

export interface ModifyPasswordP {
  status_code: number;
}

export interface ModifyUserInfoQ {
  id: string;
  new_user_info: UserInfo;
}

export interface ModifyUserInfoP {
  status_code: number;
}

export interface GetUserInfoQ {
  id: string;
}

export interface GetUserInfoP {
  status_code: number;
  user_info: UserInfo;
}


