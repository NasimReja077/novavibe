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
          .trim()
          .normalizeEmail()
          .isEmail().withMessage("Invalid email format"),
     body("password")
          .trim()
          .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
     body("username")
          .trim()
          .notEmpty().withMessage("Username is required")
          .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
     validateRequest
]

export const validateLoginUser = [
     body("email")
          .trim()
          .normalizeEmail()
          .isEmail().withMessage("Invalid email format"),
     body("password")
          .trim()
          .notEmpty().withMessage("Password is required"),
     validateRequest
]
