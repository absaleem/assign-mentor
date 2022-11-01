const express=require("express");
const router=express.Router();
const Mentormodule= require("../modules/Mentormodule");

router.post("/creatementor",Mentormodule.creatementor);
router.post("/createstudent",Mentormodule.createstudent);
router.put("/changestudentmentor/:id",Mentormodule.changestudentmentor);
router.post("/assignstudentmentor",Mentormodule.assignstudentmentor);
router.post("/listmentorstudents",Mentormodule.listmentorstudents);

module.exports=  router;