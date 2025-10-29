const ArrayCollect = {
	getObjByKey: <T>(
		collections: T[] = [],
		key: string = "id",
		value: string = "",
	): T | boolean => {
		let obj = {} as T

		if (collections.length === 0 || typeof collections == "undefined")
			return false

		for (let i = 0; i < collections.length; i++) {
			const collection = collections[i] as Record<string, any>

			if (collection[key] === value) {
				obj = collection as T
			}
		}
		return obj as T
	},
}

export default ArrayCollect
