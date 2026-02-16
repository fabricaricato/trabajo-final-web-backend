import { model, Schema } from "mongoose"
import { IUser } from "../interfaces/IUser"

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    default: "New User"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
  { versionKey: false }
)

const User = model<IUser>('User', UserSchema)

export { User }