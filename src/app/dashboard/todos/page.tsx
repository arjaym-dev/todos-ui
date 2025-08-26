"use client"

import dynamic from "next/dynamic"

const Todos = dynamic(() => import("@/container/todos"), { ssr: false })

const Page = () => {
	return <Todos />
}

export default Page
