import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://13.250.121.197/api/:path*",
				// destination: "http://localhost:5000/api/:path*",
			},
		]
	},
}

export default nextConfig
