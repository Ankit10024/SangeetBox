import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	console.log("Auth headers:", req.headers);
	console.log("Clerk auth object:", req.auth);
	
	if (!req.auth.userId) {
		console.log("Authentication failed - no userId in auth object");
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	
	console.log("Authenticated user ID:", req.auth.userId);
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};