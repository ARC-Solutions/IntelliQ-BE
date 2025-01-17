import { supabase } from "../config/db.js";

export const isAuthenticated = async (req, res, next) => {
  // Read from Authorization header
  const headerToken = req.headers["authorization"]?.split(" ")[1];

  // Read from cookies
  const cookieToken = req.cookies?.token;
  //console.log(cookieToken);

  // Use the first available token
  const token = headerToken || cookieToken;
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Supabase Auth Error:", error);
      return res.status(401).json({
        error: "Token validation failed",
        details: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      error: "Authentication failed",
      details: error.message,
    });
  }
};
