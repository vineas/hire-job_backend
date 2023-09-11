const nodemailer = require("nodemailer");

module.exports = async (
  perekrut_perusahaan,
  pekerja_email,
  pekerja_name,
  hiring_title,
  hiring_message,
  subject
) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.SMTP_HOST,
      // service: process.env.SMTP_SERVICE,
      // port: Number(process.env.SMTP_EMAIL_PORT),
      // secure: Boolean(process.env.SMTP_SECURE),
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL_USER,
      to: pekerja_email,
      subject: subject,
      html: `<div style="background-color: #FBF7F5; display:flex;">
      <img src="https://cdn.discordapp.com/attachments/1118733891738554480/1147721385767080047/Screenshot_119-removebg-preview.png" style="width: 200px;height: 100%;"/>
    </div>
    <div style="padding:20px">
      <p>
        Dear ${pekerja_name}
      </p>
      <p>
        Position ${hiring_title} at ${perekrut_perusahaan}
      </p>
    <p>
    ${hiring_message}
      </p>
    </div>
`,
    });
    // console.log("email sent successfully");
  } catch (error) {
    // console.log("email not sent!");
    console.log(error);
    return error;
  }
};