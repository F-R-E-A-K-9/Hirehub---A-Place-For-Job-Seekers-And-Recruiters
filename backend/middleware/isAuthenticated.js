import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded ke andar hota hai: { userId: "...", iat: ..., exp: ... }
    req.id = decoded.userId;

    next(); // sab sahi hai, ab agle function (controller) tak jaane do
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authenticateToken;
