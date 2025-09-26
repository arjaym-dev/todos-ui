import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: process.env
					.NEXT_PUBLIC_REVERSE_PROXY_URL as string,
			},
		]
	},
}

export default nextConfig
