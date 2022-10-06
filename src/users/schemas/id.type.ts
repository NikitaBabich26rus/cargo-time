import {emailRegularExpression, phoneNumberRegularExpression} from "../../common/regular.expressions";

export enum IdType {
    Email = 0,
    PhoneNumber = 1,
}

export const getIdType = (id: string): IdType | null => {
    if (emailRegularExpression.test(id)){
        return IdType.Email
    }

    if (phoneNumberRegularExpression.test(id)){
        return IdType.PhoneNumber
    }

    return null
}