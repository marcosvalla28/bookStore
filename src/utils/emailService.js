const nodemailer = require('nodemailer');

//CONFIGURAR EL "TRANSPORTER" DE NODEMAILER
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

//ENVIAR EMAIL DE VERIFICACION
const sendVerificationEmail = async (email, userName, userCode) => {
    const mailOptions = {
    from:`"BOOKSTORE📚" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta - BOOKSTORE',
    html:`
    <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #F4F4F4;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              padding: 20px;
              background-color: #F0F0F0;
              border-radius: 5px;
              letter-spacing: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2>¡Bienvenido/a ${userName}!</h2>
              <p>Gracias por registrarte en nuestra Tienda de Libros.</p>
              <p>Para completar tu registro, por favor verifica tu cuenta usando el siguiente código:</p>
              <div class="code">${userCode}</div>
              <p><strong>Este código expira en 15 minutos.</strong></p>
              <p>Si no solicitaste este registro, puedes ignorar este email.</p>
            </div>
            <div class="footer">
              <p>© 2025 BOOKSTORE. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    
    `
    }
try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de verificacion enviado a: ${email}`)
    return true
} catch (error) {
    console.error('❌ Error al enviar el email:', error);
    throw new Error('No se pudo enviar el email de verificacion')
}
}



module.exports = {
  sendVerificationEmail
};