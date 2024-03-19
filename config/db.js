import mongoose from 'mongoose'

export const conectarDB = async() => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // <-- no longer necessary
      useUnifiedTopology: true // <-- no longer necessary
    })

    const url = `${db.connection.host}:${db.connection.port}`
    console.log(`MongoDB conectado en:  ${url}`)
  } catch (error) {
    console.log(`error: ${error.message}`)
    process.exit(1)
  }
}
