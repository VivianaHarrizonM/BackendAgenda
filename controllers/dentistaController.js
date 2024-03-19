import Dentista from "../models/Dentista.js";
import { generarJWT } from "../helpers/generarJWT.js";
import { generarId } from "../helpers/generarId.js";
import { emailRegistro } from "../helpers/emailRegistro.js";
import { emailOlvidePassword } from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const {email, nombre} = req.body;

  //Prevenir usuarios duplicados
  const existeUsuario = await Dentista.findOne({email})

  if(existeUsuario) {
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({msg: error.message})
  }

  try {
    //Guardar un nuevo dentista
    const dentista = new Dentista(req.body)
    const dentistaGuardado = await dentista.save()

    // Enviar el email
    emailRegistro({
      email,
      nombre,
      token: dentistaGuardado.token
    })

    res.json(dentistaGuardado)
  } catch (error) {
    console.log(error)
  }

}

const perfil = (req, res) => {

  const { dentista } = req
 
  res.json(dentista)
}

const confirmar = async (req, res) => {
  const {token} = req.params

  const usuarioConfirmar = await Dentista.findOne({token})

  if(!usuarioConfirmar) {
    const error = new Error('Token no válido')
    return res.status(404).json({msg: error.message})
  }

  try {
    usuarioConfirmar.token = null
    usuarioConfirmar.confirmado = true
    await  usuarioConfirmar.save()
    res.json({msg: "Usuario Confirmado Correctamente"})
  } catch (error) {
    console.log(error)
  }

}

const autenticar = async (req, res) => {
  const { email, password } = req.body

  // Comprobar si el usuario existe
  const usuario = await Dentista.findOne({email})

  if(!usuario) {
    const error = new Error("El Usuario no existe")
    return res.status(404).json({msg: error.message})
  }

  // Comprobar si el usuario está confirmado o no
  if(!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada")
    return res.status(403).json({msg: error.message})
  }

  // Revisar el password
  if(await usuario.comprobarPassword(password)) {
    // Autenticar
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id)
    })
  } else {
    const error = new Error("El Password es incorrecto")
    return res.status(403).json({msg: error.message})
  }


}

const olvidePassword = async (req, res) => {
  const {email} = req.body

  const existeDentista = await Dentista.findOne({email})
  if(!existeDentista) {
    const error = new Error("El usuario no existe")
    return res.status(400).json({msg: error.message})
  }

  try {
    existeDentista.token = generarId()
    await existeDentista.save()

    // Enviar email con instraucciones
    emailOlvidePassword({
      email,
      nombre: existeDentista.nombre,
      token: existeDentista.token
    })
    res.json({msg: "Hemos enviado un email con las instrucciones"})
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async(req, res) => {
  const {token} = req.params

  const tokenValido = await Dentista.findOne({token})

  if(tokenValido) {
    // El token es válido el usuario existe
    res.json({msg: "Token válido y el usuario existe"})
  } else {
    const error = new Error("Token no válido")
    return res.status(400).json({msg: error.message})
  }
}

const nuevoPassword = async (req, res) => {
  const {token} = req.params
  const {password} = req.body

  const dentista = await Dentista.findOne({token})
  if(!dentista) {
    const error = new Error('Hubo un error')
    return res.status(404).json({msg: error.message})
  }

  try {
    dentista.token = null
    dentista.password = password
    await dentista.save()
    res.json({msg: 'Password moficiado correctamente'})
  } catch (error) {
    console.log(error)
  }
}

const actualizarPerfil = async (req, res) => {
  const dentista = await  Dentista.findById(req.params.id)
  if(!dentista) {
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message})
  }

  const {email} = req.body
  if(dentista.email !== req.body.email) {
    const existeEmail = await Dentista.findOne({email})
    if(existeEmail) {
      const error = new Error('Ese email ya está en uso')
      return res.status(400).json({msg: error.message})
    }
  }

  try {
    dentista.nombre = req.body.nombre
    dentista.email = req.body.email
    dentista.telefono = req.body.telefono
    dentista.web = req.body.web
    // dentista.nombre = req.body.nombre || dentista.nombre
    // dentista.email = req.body.email || dentista.email
    // dentista.telefono = req.body.telefono || dentista.telefono
    // dentista.web = req.body.web || dentista.web

    const dentistaActualizado = await dentista.save()
    res.json(dentistaActualizado)
  } catch (error) {
    console.log(error)
  }
}

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const {id} = req.dentista
  const {pwd_actual, pwd_nuevo} = req.body

  // Comprobar que el dentista existe
  const dentista = await  Dentista.findById(id)
  if(!dentista) {
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message})
  }


  // Comprobar su password 
  if(await dentista.comprobarPassword(pwd_actual)) {
    //Almacenar el nuevo password
    dentista.password = pwd_nuevo
    await dentista.save()
    res.json({msg: 'Password Almacenado Correctamente'})
  } else {
    const error = new Error('El password actual es incorrecto')
    return res.status(400).json({msg: error.message})
  }
  

}

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
}