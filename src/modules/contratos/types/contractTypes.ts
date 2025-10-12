import { Contract } from "../models/contract"

export type CardContractProps = {
    contract: Contract,
    onEdit?: () => void
}