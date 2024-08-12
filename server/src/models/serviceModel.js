module.exports.findServiceById = async (data) => {
    const service = await prisma.um_service.findUnique({
      where: {
        service_id: data.service_id
      }
    })
  
    return service;
  }

module.exports.insertCode = async (data) => {
  const verificationCode = await prisma.um_service.create({
    data : { 
      service_id : data.service_id, 
      
    }
  })
}