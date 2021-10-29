

exports.deleteOne = (Model) => async(req,res,next) => {
    
    try {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
             throw new Error('No document found with that id')
        }
        res.status(204).json({
            "success": true,
            data:null
        })

    } catch (error) {
        res.status(403).json({
            "status": "error"
        })
    }


}

