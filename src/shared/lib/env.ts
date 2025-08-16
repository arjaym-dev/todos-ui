const ENV = {
	MONGODB_URI: process.env.MONGODB_URI,
	SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
} as { MONGODB_URI: string; SESSION_SECRET_KEY: string }

export default ENV
