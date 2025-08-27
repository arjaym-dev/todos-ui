"use client"

import dynamic from "next/dynamic"

const Roles = dynamic(() => import("@/container/roles"), { ssr: false })
const Page = () => {
	return <Roles />
}

export default Page
