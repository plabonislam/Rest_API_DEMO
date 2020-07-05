const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const User = require("../models/user");
const check=require('../middleware/check-auth');

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        bcrypt.hash(req.body.password, 10, (err, result) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: result,
            });

            user
              .save()
              .then((resu) => {
                console.log(resu);
                res.status(201).json({
                  created: "User created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      } else {
        res.status(409).json({
          Mess: "Mail Exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

router.post("/signin", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        res.status(404).json({
          err: "Auth faild",
        });
      } else {
         bcrypt.compare(
            req.body.password,
            users[0].password,
            (err, result) => {
                if(err){
                  return  res.status(500).json({
                        err:"Password failed"
                    });
                }
                if(result){
                    //for match 
                 const token=   jwt.sign(
                      {
                        email: req.body.email,
                        _id: req.body._id,
                      },
                      process.env.JWT_secret,
                      {
                          expiresIn:"1h"
                      }
                    );
                    res.status(200).json({
                      mess: "Log in",
                      token: token
                    });
                }
                else{
                    //for nat password match
                    return res.status(500).json({
                        err:"Auth failed"
                    })

                }
            });
    
        
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: "Auth Faild!!",
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.remove({ _id: userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        mess: "user Removed",
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = router;
