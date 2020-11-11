const APP_SECRET = process.env.APP_SECRET || "1q2w3e4r";

export default {
  jwt: {
    secret: APP_SECRET,
    expired_in: '1d'
  },
}
