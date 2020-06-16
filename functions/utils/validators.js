const Joi = require('joi');

const isEmpty = (content) => {
    if(!content) return true;
    else return false;
};

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.validateLoginData = (data) => {
    let errors = {};
    if(isEmpty(data.email)) errors.email = 'Must not be empty!';
    if(isEmpty(data.password)) errors.password = 'Must not be empty!';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    };
};

exports.validateSignUpData = (data) => {
    let errors = {};
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required().regex(emailRegEx).error(() => {return errors.error = 'Is not a valid Email'}),
        phoneNumber: Joi.string().required(),
        country: Joi.string().required(),
        password: Joi.string().required().min(6),
        confirmPassword: Joi.string().required().equal(data.password),
        username: Joi.string().required().token()
    })

    Joi.validate(data, schema, (err) => {
        if(err) errors.error = err.message;
    });
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}