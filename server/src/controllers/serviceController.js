module.exports.generateCode = async (req, res, next) => {
    const codeLength = 5; // desired length of the random code

    function generateRandomCode(length) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    const randomCode = generateRandomCode(codeLength);
    res.status(200).send({ message: randomCode });


    //   try {
    // const randomCode = generateRandomCode(codeLength);
    // res.status(200).send({message : randomCode});
    //   } catch {
    //     res.status(404).json({ message: 'Error generating code' });
    //   }
    //iteModel.addCodeToTable
}

module.exports.readServiceById = async (req, res, next) => {

    const data = { 
      service_id : req.params.service_id
    }
    try {
      const service = await userModel.findServiceById(data);
  
      if (service) {
        next();
      }
      else {
        return res.status(409).json({ message: "Error!!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  
  }