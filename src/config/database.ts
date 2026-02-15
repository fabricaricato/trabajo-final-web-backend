import { config } from "dotenv"
import { connect } from "mongoose"
config()

const URI_DB = process.env.URI_DB

const connectDb = async () => {
  try {
    await connect(URI_DB)
    console.log("🟢 CONNECTED SUCCESSFULLY 🟢")
  } catch (error) {
    console.log(`🔴 FAILED TO CONNECT DATABASE 🔴 MESSAGE: ${error.message}`)
  }
}

export {connectDb}