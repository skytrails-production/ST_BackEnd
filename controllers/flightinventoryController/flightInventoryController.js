const flightInventory = require("../../model/flightinventory/flightDetails");


exports.getFlight = async (req,res) => {
    try{
        const newflight = new flightInventory(req.body);
        const flightvalue = await newflight.save();
        res.status(200).json({ 
            message: 'Successfully submitted the form',
            flight: flightvalue });
        }
        catch(error){
        res.status(400).json({message: error.message});
        }
}