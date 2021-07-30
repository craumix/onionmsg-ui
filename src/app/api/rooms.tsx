const apiProto = 'http://'
const baseUrl = 'localhost:10052'
const apiVer = 'v1'

function constructUrl(endpoint: string, form?: Map<string, string>): string {
    if(endpoint.startsWith('/')) {
        endpoint = endpoint.substr(1)
    }

    const url = new URL(apiProto + baseUrl + '/' + apiVer + '/' + endpoint)
    form?.forEach((value, key) => url.searchParams.append(key, value))

    return url.toString()
}

function apiGET(endpoint: string, form?: Map<string, string>): Promise<Response> {
    return fetch(constructUrl(endpoint, form))
}

function apiPOST(endpoint: string, data: string, form?: Map<string, string>): Promise<Response> {
    return fetch(constructUrl(endpoint, form), {
        method: 'POST',
        body: data
    })
}

export function fetchRoomList(): Promise<Response> {
    return apiGET('/room/list')
}

export function fetchRoomMessages(uuid: string): Promise<Response> {
    return apiGET('/room/messages', new Map([['uuid', uuid]]))
}

export function postMessageToRoom(uuid: string, data: string): Promise<Response> {
    return apiPOST('/room/send/message', data, new Map([['uuid', uuid]]))
}