import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination:
					process.env.NODE_ENV === "development"
						? "http://localhost:5000/api/:path*"
						: "3.0.97.40/api/:path*",
			},
		]
	},
}

export default nextConfig
