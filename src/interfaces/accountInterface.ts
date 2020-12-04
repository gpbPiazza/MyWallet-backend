export default interface Account {
    userId: number,
    balance: string,
}

export interface TransactionParams {
    userId: number,
    typeTransaction: string,
    value: string,
    description: string
}

export interface Transaction {
    userId: number,
    typeTransaction: string,
    value: string,
    description: string,
    dateTranscrition: Date
}
