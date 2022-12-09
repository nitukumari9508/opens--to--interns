const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModels")


const createCollege = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*')
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data" })

    const { name, fullName, logoLink } = data

    if (!name) return res.status(400).send({ status: false, message: "please provide name" })
    const validName = (/^[a-z .]{3,50}$/)
    if (!validName.test(name)) return res.status(400).send({ status: false, message: "Invalid name." })

    let check = await collegeModel.findOne({name:name})
    if(check){return res.status(400).send({ status: false, message: "college is already present." })}

    if (!fullName) return res.status(400).send({ status: false, message: "please provide fullname" })

    const validFullName =/^[A-Za-z][A-Za-z ._,]{5,50}$/
    
    if (!validFullName.test(fullName)) return res.status(400).send({ status: false, message: "Invalid fullname." })

    
    if (!logoLink) return res.status(400).send({ status: false, message: "please provide logolink" })

    const validLogoLink=/^https?:\/\/(.+\/)+.+(\.(png|jpg|jpeg))$/i
    if(!validLogoLink.test(logoLink)){return res.status(400).send({ status: false, message: "Invalid logolink." })}
    
        const result = await collegeModel.create(data);
    return res.status(201).send({ status: true, data: {name : result.name,
    fullName : result.fullName,
    logoLink : result.logoLink,
    isDeleted:result.isDeleted
  }});
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



const getInterns = async function (req,res){
  res.setHeader('Access-Control-Allow-Origin','*')
    try{
    
    
    const collegeName = req.query.collegeName

    
    if(!collegeName){return res.status(400).send({status:false,message:"cannot provide empty query"})}
    let colLege= await collegeModel.findOne({name:collegeName})
    if(!colLege){ return res.status(404).send({status:false,message:"No such college found"})}
    
    let interns = await internModel.find({isDeleted:false,collegeName:collegeName}).select({isDeleted:0,createdAt:0,updatedAt:0,collegeId:0,__v:0})
    if(interns.length===0){interns = "No interns enrolled"}
    
    let tosend ={name:colLege.name,
                 fullName:colLege.fullName,
                 logoLink:colLege.logoLink,
                 interns:interns}
    console.log(tosend)
    
    res.status(200).send({status:true,data:tosend})
    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}






module.exports={createCollege,getInterns}

