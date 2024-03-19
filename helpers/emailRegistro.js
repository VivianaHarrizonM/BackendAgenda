import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const {email, nombre, token} = datos

  // Enviar el email
  const info = await transporter.sendMail({
    from: "APD - Administrador de Pacientes de Dentista",
    to: email,
    subject: 'Comprueba tu cuenta en APD',
    text: 'Comprueba tu cuenta en APD',
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APD. </p>
    <p>Tu cuenta ya está lista, sólo debes comprobarla en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `

  })
  console.log("Mensaje Enviado: %s", info.messageId)
}