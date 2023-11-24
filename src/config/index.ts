if (!process.env.PORT || !process.env.SECRET || !process.env.SITE_URL || !process.env.PROTOCOL) {
  throw new Error("Missing envs")
}

export const PORT = process.env.PORT
export const SECRET = process.env.SECRET
export const SITE_URL = process.env.SITE_URL
export const PROTOCOL = process.env.PROTOCOL
