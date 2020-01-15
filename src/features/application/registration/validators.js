import { isEmptyString } from '../../../utils/isEmptyString'
import { MaxDescriptionLength, MaxNameLength, MaxUrlLength } from './constants'
import { hasLength } from '../../../utils/hasLength'
import { generateMasterKeys, getAccountIdFromPublicKey } from '@burstjs/crypto'
import { assureAccountId } from '../../../utils/assureAccountId'

const isRequiredAndHasCorrectLength = (str, maxLength) => !isEmptyString(str) || hasLength(str, 1, maxLength)

export const isValidAccount = (account) => {
    return !isEmptyString(account)
}

export const isValidName = (name) => {
    return isRequiredAndHasCorrectLength(name, MaxNameLength)
}

export const isValidDescription = (desc) => {
    return isRequiredAndHasCorrectLength(desc, MaxDescriptionLength)
}

export const isValidRepo = (repo) => {
    return hasLength(repo, 0, MaxUrlLength)
}

export const isValidImageUrl = (img) => {
    return isRequiredAndHasCorrectLength(img, MaxUrlLength)
}

export const isValidPassphrase = (phrase, account) => {
    const { publicKey } = generateMasterKeys(phrase)
    const accountId = getAccountIdFromPublicKey(publicKey)
    return accountId === assureAccountId(account)
}
