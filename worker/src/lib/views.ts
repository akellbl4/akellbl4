const prefix = `views:`

export async function getViews(kv: KVNamespace, slug: string): Promise<number> {
	const value = await kv.get<number>(`${prefix}${slug}`, 'json')

	return value === null ? 1 : value
}

export async function setViews(kv: KVNamespace, slug: string, count: number) {
	return kv.put(`${prefix}${slug}`, JSON.stringify(count))
}
