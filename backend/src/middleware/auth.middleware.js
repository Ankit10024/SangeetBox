import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      console.log("Authentication failed - no userId in auth object");
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    console.log("Authenticated user ID:", req.auth.userId);
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    console.log("process.env.ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("currentUser.primaryEmailAddress.emailAddress:", currentUser.primaryEmailAddress?.emailAddress);

    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      console.log("Admin check failed: emails do not match.");
      return res.status(403).json({ message: "Unauthorized - you must be an admin" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
