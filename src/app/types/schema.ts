import {JSONSchema} from "@ngx-pwa/local-storage";

export const UserInfoS: JSONSchema = {
  type: "object",
  properties: {
    login: { type: 'boolean'},
    info: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        role: {type: 'string'},
        avatar: {type: 'string'}
      }
    }
  },
  required: ['login']
}
