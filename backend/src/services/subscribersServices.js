import subscribersModel from '../models/subscribersModel.js'

export const getAllSubs = async () => {
    return await subscribersModel.find()
}