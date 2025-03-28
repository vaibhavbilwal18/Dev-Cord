
const authadmin = (req , res , next) => {
    const token = "xyz";
    const authorized = (token == "xyz");
    if(!authorized){
        res.status(401).send("Un-Authorized Access");
    }else{
        next();
    }
}

module.exports ={authadmin};