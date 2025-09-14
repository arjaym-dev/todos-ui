import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://13.250.121.197/api/:path*",
				// destination: "http://localhost:5001/api/:path*",
				// destination: "http://host.docker.internal:5001/api/:path*",
			},
		]
	},
}

export default nextConfig
