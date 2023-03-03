export function timeConverter(UNIX_timestamp) {
	const time = new Date(UNIX_timestamp * 1000)
	return `${time.getHours()}:${time.getMinutes()}`
}