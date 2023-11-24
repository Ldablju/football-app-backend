import nodemailer from "nodemailer";

export const mailTransporter = () => {
  return nodemailer.createTransport({
    host: "server916785.nazwa.pl",
    port: 465,
    secure: true,
    auth: {
      user: "admin@server916785.nazwa.pl",
      pass: "Nazwa4142!",
    },
    logger: true,
  });
};
