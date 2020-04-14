import { readable, writable } from 'svelte/store'
import { ApplicationTokenService } from '../services/applicationTokenService'
import { isClientSide } from '../utils/isClientSide'
import { Events } from '../utils/events'

const InitialSyncProgressState = 0
const UpdateInterval = 60 * 1000
const InitialTokensState = {
    filter: null,
    items: [],
}

const syncProgress$ = readable(InitialSyncProgressState, (set) => {
    if (!isClientSide()) return
    const service = new ApplicationTokenService()
    let updateProgress = ({ detail }) => {
        const { total, processed } = detail
        set(total && processed / total)
    }
    window.addEventListener(Events.Progress, updateProgress)
    service.syncTokens()
    const interval = setInterval(service.syncTokens.bind(service), UpdateInterval)
    return () => {
        clearInterval(interval)
        window.removeEventListener(Events.Progress, updateProgress)
        set(InitialSyncProgressState)
    }
})

const tokens$ = writable(InitialTokensState, (set) => {
    if (!isClientSide()) return
    const service = new ApplicationTokenService()
    const updateTokens = () => {
        service.getTokens().then(tokens => {
            tokens$.update(state => ({
                ...state,
                items: tokens,
            }))
        })
    }
    window.addEventListener(Events.Finish, updateTokens)
    updateTokens()
    return () => {
        set(InitialTokensState)
        window.removeEventListener(Events.Finish, updateTokens)
    }
})

const filterTokensBy = filter => {
    // todo apply filter
}

export {
    tokens$,
    syncProgress$,
    filterTokensBy,
}
