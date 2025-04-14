import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
	{
		title: "Ishq Hai",
		artist: "Anurag Saikia",
		imageUrl: "/cover-images/1.jpg",
		audioUrl: "/songs/1.mp3",
		duration: 39, // 0:39
	},
	{
		title: "Tere bina",
		artist: "Shreea Kaur",
		imageUrl: "/cover-images/16.jpg",
		audioUrl: "/songs/16.mp3",
		duration: 41, // 0:41
	},
	{
		title: "Homa Dol",
		artist: "Saad Lamjarred, Neeti Mohan, Rajat Nagpal",
		imageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/3.mp3",
		duration: 24, // 0:24
	},
	{
		title: "Ahista Ahista",
		artist: "KaZanami",
		imageUrl: "/cover-images/4.png",
		audioUrl: "/songs/4.mp3",
		duration: 24, // 0:24
	},
	{
		title: "Agar tum Saath Ho",
		artist: "Arijit Singh, Alka Yagnik",
		imageUrl: "/cover-images/5.jpg",
		audioUrl: "/songs/5.mp3",
		duration: 36, // 0:36
	},
	{
		title: "Jhol",
		artist: "Maanu,Annural",
		imageUrl: "/cover-images/6.jpg",
		audioUrl: "/songs/6.mp3",
		duration: 240, // 0:40
	},
	
	{
		title: "Main Ishq Likhun",
		artist: "Faheem Abdullah",
		imageUrl: "/cover-images/7.jpg",
		audioUrl: "/songs/7.mp3",
		duration: 128, // 0:28
	},
	{
		title: "Ek Jaisa Haal tere mera",
		artist: "Arijit Singh",
		imageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/8.mp3",
		duration: 228, // 0:28
	},
	
	{
		title: "Tujh me rab dikhta hai",
		artist: "Roop Kumar Rathod",
		imageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/9.mp3",
		duration: 229, // 0:29
	},
	{
		title: "Tu hai to Main hoon",
		artist: "Arijit Singh",
		imageUrl: "/cover-images/10.jpeg",
		audioUrl: "/songs/10.mp3",
		duration: 117, // 0:17
	},
	{
		title: "Milenge Hum Nhi",
		artist: "Kunal Verma",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/11.mp3",
		duration: 239, // 0:39
	},
	{
		title: "Kanha",
		artist: "Shreya Ghoshal",
		imageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/12.mp3",
		duration: 127, // 0:27
	},
	{
		title: "Fell for You",
		artist: "Shubh",
		imageUrl: "/cover-images/13.jpg",
		audioUrl: "/songs/13.mp3",
		duration: 136, // 0:36
	},
	{
		title: "Pehla tere nain dekdhe",
		artist: "Josh Brar",
		imageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/14.mp3",
		duration: 139, // 0:39
	},
	{
		title: "Espresso",
		artist: "Sabrina",
		imageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/15.mp3",
		duration: 139, // 0:39
	},
	{
		title: "Ride It",
		artist: "Jay Sean",
		imageUrl: "/cover-images/2.jpg",
		audioUrl: "/songs/2.mp3",
		duration: 129, // 0:29
	},
];

const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing songs
		await Song.deleteMany({});

		// Insert new songs
		await Song.insertMany(songs);

		console.log("Songs seeded successfully!");
	} catch (error) {
		console.error("Error seeding songs:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();