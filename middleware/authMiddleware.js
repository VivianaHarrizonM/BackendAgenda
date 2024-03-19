import jwt from 'jsonwebtoken'
import Dentista from '../models/Dentista.js'

export const checkAuth = async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.dentista = await Dentista.findById(decoded.id).select("-password -token -confirmado")
      
      return next()
    } catch (error) {
      const e = new Error('Token no Válido o inexistente')
      return res.status(403).json({msg: e.message})
      
    }
  } 

  if(!token) {
    const error = new Error('Token no Válido o inexistente')
    res.status(403).json({msg: error.message})
  }

  next()
}