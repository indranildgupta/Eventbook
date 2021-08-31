import jwt from 'jsonwebtoken';


const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // google auth token is very large
        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token,'test');

            req.userId = decodedData?.id;
        }else{
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;   // sub uniquely differentiate google ids
        }

        next();

    }catch(err){
        console.log(err);
    }
}

export default auth;