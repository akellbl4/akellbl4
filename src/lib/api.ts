import { request } from 'lib/request'

export const api = request.create('/api')

export async function fetcher<T>(url: string): Promise<T> {
	const { data } = await api.get<T>(url)

	return data
}
