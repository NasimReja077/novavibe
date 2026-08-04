import { body, validationResult } from "express-validator";

function validateRequest(req, res, next){
     const errors = validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json(
               { 
                    errors: errors.array() 
               }
          );
     }

     next();
}

export const validateRegisterUser = [
     body("email")
          .isEmail().withMessage("Invalid Email Format"),
     body("password")
          .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
     body("username")
          .notEmpty().withMessage("Username is required")
          .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
     validateRequest
]

export const validateLoginUser = [
     body("email")
          .isEmail().withMessage("Invalid email format"),
     body("password")
          .notEmpty().withMessage("password is required"),
     validateRequest
]
