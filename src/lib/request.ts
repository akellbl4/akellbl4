export type Method = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'
export type Options = {
	url?: string
	method?: Method
	baseURL?: string
	headers?: Record<string, string>
	responseType?: 'text' | 'json'
}

type ResponseFields = {
	status: number
	statusText: string
	config: Options
	headers: Headers
	redirect: boolean
	url: string
	type: ResponseType
	body: ReadableStream<Uint8Array> | null
	bodyUsed: boolean
}

type Response<T> = { data: T } & ResponseFields

class RequestError<T> extends Error {
	res: Response<T>

	constructor(message: string, res: Response<T>) {
		super(message)
		this.res = res
	}
}

export const request = (function create(baseURL = '') {
	function request<T>(
		uri: string,
		options: Options | undefined,
		method?: Method,
		data?: string | object
	): Promise<Response<T>> {
		const headers: Record<string, string> = { ...options?.headers }
		let responseType = options?.responseType || 'text'
		let body = typeof data === 'string' ? data : undefined

		if (typeof data === 'object') {
			body = JSON.stringify(data)
			headers['content-type'] = 'application/json'
			responseType = 'json'
		}

		const url = `${options?.baseURL || baseURL}${uri}`
		const init = { method, headers, body }

		return fetch(url, init).then((res) => {
			const response = {} as Response<T>

			for (const i in res) {
				const value = res[i as keyof typeof res]

				if (typeof value !== 'function') {
					Object.assign(response, { [i]: value })
				}
			}

			return res[responseType]()
				.then((d) => {
					response.data = d
					response.data = JSON.parse(d)
				})
				.catch(Object)
				.then(() => {
					if (process.env.NODE_ENV === 'development' && res.status < 400) {
						// eslint-disable-next-line no-console
						console.info(
							`%c%s %c%s %s`,
							'font-weight: bold',
							res.status,
							'font-weight: normal',
							init.method || 'GET',
							url,
							typeof window === 'undefined' ? '' : data
						)
					}

					if (!res.ok) {
						throw new RequestError(
							`Request error occured while ${method} request to ${url}`,
							response
						)
					}

					return response
				})
		})
	}

	request.get = <T = unknown>(url: string, config?: Options): Promise<Response<T>> =>
		request(url, config, 'GET')
	request.post = <T = unknown>(
		url: string,
		data?: string | object,
		config?: Options
	): Promise<Response<T>> => request(url, config, 'POST', data)
	request.create = create
	request.cancel = typeof AbortController == 'function' ? AbortController : Object

	return request
})()
