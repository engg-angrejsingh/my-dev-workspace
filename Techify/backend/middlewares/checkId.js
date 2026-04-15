import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            error: `Invalid ObjectId: ${id}`
        });
    }

    next();
}

export default checkId;