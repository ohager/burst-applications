import { dispatchEvent } from '../utils/dispatchEvent'
import { BurstApi } from '../utils/burstApi.js'
import { BurstValue } from '@burstjs/util'
import { generateMasterKeys, getAccountIdFromPublicKey } from '@burstjs/crypto'

export class AccountService {
    constructor() {
        this._dispatch = dispatchEvent
        this._accountApi = BurstApi.account
        this._contractApi = BurstApi.contract
    }

    async getSuggestedFee() {
        const fees = await BurstApi.network.suggestFee()
        return BurstValue.fromPlanck(fees.standard.toString(10))
    }

    getKeys(passphrase) {
        const { publicKey, signPrivateKey } = generateMasterKeys(passphrase)
        return {
            publicKey,
            signPrivateKey,
        }
    }

    getAccountIdFromPassphrase(passphrase) {
        const {publicKey} = this.getKeys(passphrase)
        return getAccountIdFromPublicKey(publicKey)
    }

    async getBalance(accountId) {
        const { balanceNQT } = await this._accountApi.getAccountBalance(accountId)
        return BurstValue.fromPlanck(balanceNQT)
    }

}

export const accountService = new AccountService()