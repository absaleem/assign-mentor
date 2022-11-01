const { ObjectID } = require("bson");
const  mongo  = require("../connect.js");
const { ObjectId } = require("mongodb");

  
module.exports.creatementor=async(req,res,next)=>{
    try{
      responseInserted = await mongo.selectedDB.collection("mentors").insertOne(req.body);
      res.send(responseInserted);
    }catch(error){
        console.error(error);
        res.status(500).send(error);
    }

};

module.exports.createstudent=async(req,res,next)=>{
    try{
      responseInserted = await mongo.selectedDB.collection("students").insertOne(req.body);
      res.send(responseInserted);
    }catch(error){
        console.error(error);
        res.status(500).send(error);
    }

};

module.exports.assignstudentmentor=async(req,res,next)=>{
    try{
        const studentArrayId = req.body.student_id; let studExists=[]; let studSuccess=[];
     
        for (let stud = 0; stud < studentArrayId.length; stud++) {
              var student_ids = studentArrayId[stud];
              const checkStudentExists = await mongo.selectedDB.collection("mentor_students").findOne({ student_id:student_ids });
              console.log(checkStudentExists);
              if(checkStudentExists){
                studExists.push(student_ids);
              //  console.log('exists'+student_ids);
              }else{
                req.body.student_id = student_ids; studSuccess.push(student_ids);
                //console.log('success'+student_ids);
                responseInserted = await mongo.selectedDB.collection("mentor_students").insertOne({...req.body});
                req.body.student_id='';
               }  
            }
              
           if(studExists.length === studentArrayId.length){
                 res.status(400).send({"msg":"The students are already under mentor"});
           }
           else if(studExists.length>0){
                res.send({"msg":studExists+" students are already under mentor but the students "+studSuccess+" are assigned to mentor successfully"});  
           }else{
                 res.send({"msg":"All students are assigned to mentor successfully"});  
           }

    }catch(error){
        console.error(error);
        res.status(500).send(error);    
    }
};


module.exports.changestudentmentor=async(req,res,next)=>{

  try{
    const student_id=req.params.id; const mentor_id=req.body.mentor_id;
    const updatedData= await mongo.selectedDB.collection("mentor_students").findOneAndUpdate(
    { student_id: student_id },
    { $set: { 'mentor_id':mentor_id } },
    { returnDocument: "after" },   
    );
    res.send({"msg":"Updated successfully"});
    }  catch(error){
        res.status(500).send(error);
    } 
};

module.exports.listmentorstudents= async(req,res,next)=>{
  console.log(req.body.mentor_id);
    try{

        listMentorstudents = await mongo.selectedDB.collection("mentor_students").aggregate([
          { "$match": { "mentor_id": req.body.mentor_id } },
  
          { "$lookup": {
            "let": { "userObjId": { "$toObjectId": "$student_id" } },
            "from": "students",
            "pipeline": [
              { "$match": { "$expr": { "$eq": [ "$_id", "$$userObjId" ] } } }
            ],
            "as": "userDetails"
          }},
          { $unwind : "$userDetails" }, 
          {
            $project: {
                _id:0,
                "userDetails.name":1
            }    
            }
        ]).toArray();
        res.send(listMentorstudents);
       }catch(error){ 
           res.status(500).send(error);
       }
       
      };
