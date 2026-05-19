
export type ServiceType = {
    description: string
    id: number
    isActive?: boolean
    isOptional?: boolean
    listingType?: number
    name?: string
    overheadType: overheadType
    overheadValue: number
    updatedAt?: string
}

export const overheadType ={
    Percentage : 0,
    FixedAmount : 1
} as const;

export type overheadType = typeof overheadType[keyof typeof overheadType];