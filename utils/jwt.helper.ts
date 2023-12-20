import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function verifyCredentials(args: { token?: any, type?: any } = {}) {
  const {
    token,
    type
  } = args;
  try {
    const secret = type === "accessToken" ? getAccessTokenSecret() : getRefreshTokenSecret();
    const credential = jwt.verify(token, secret);
    if (typeof credential === "string") return null;
    return credential;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error instanceof TokenExpiredError) {
        return { tokenExpired: true };
      }
    }
    throw error;
  }
}

export function getAccessTokenSecret() {
  return process.env.ACCESS_TOKEN_SECRET || "EK6iLjIlXcW59cDTUrUDrEC8YbB7Tx8d";
}

export function getRefreshTokenSecret() {
  return process.env.REFRESH_TOKEN_SECRET || "pm3Epm2w5WJ4NXzzRmUZDlHfa1Y0ZuYj"
}