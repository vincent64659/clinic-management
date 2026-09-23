const accountsService = require(".. services/accounts-services.js")

const createAccount = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await accountsService.createAccounts( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Account created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Create account error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

const findAllAccountService = require(".. services/accounts-services.js")

const findAllAccount = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await findAllAccountsService.findAllAccountService( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Find All Accounts created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Find All account error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

const findAccountsByIdService = require(".. services/accounts-services.js")

const findAccountById = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await findAccountsByIdService.findAccountByIdService( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Find Accounts By Id created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Find account By Id error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

const findAccountsByIdService = require(".. services/accounts-services.js")

const findAccountByUsername = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await findAccountsByUsernameService.findAccountByUsernameService( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Find Accounts By Username  created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Find account By Username error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

const findAccountsByIdService = require(".. services/accounts-services.js")

const updateAccount = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await findAccountsByUsernameService.updateService( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Update accounts created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Update accounts error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

const findAccountsByIdService = require(".. services/accounts-services.js")

const deleteAccount = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await deleteAccountsService.deleteService( username, password ); 
        
        return res.status(StatusCodes.CREATED).json({
            success: true, 
            message: "Delete accounts created successfully.",
            data: result,
            });
        } catch (error) {
        console.error("Delete accounts error:", error);

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || ReasonPhrases.BAD_REQUEST,
            });
        } 
    }; 

    module.export = {
        createAccount,
        findAllAccount,
        findAccountById,
        findAccountByUsername,
        updateAccount,
        deleteAccount,
    }

