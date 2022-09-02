import JWT from "jsonwebtoken";
import secretKey from "../keys";

const getUserId = (request, requireAuth = true) => {
  const token = request.request.headers.authorization;
  if (token) {
    const decoded = JWT.verify(token, secretKey);
    return decoded.id;
  }
  if (requireAuth) {
    throw new Error("Authentication required!");
  }

  return null;

  // const token = header.replace("Bearer ", "");
};

export { getUserId as default };
