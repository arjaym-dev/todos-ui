import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://host.docker.internal:5001/api/:path*",
			},
		]
	},
}

export default nextConfig
