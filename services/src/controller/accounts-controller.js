const accountsService = require(".. services/accounts-services.js")

const createAccount = async (req, res) => {
    try { 
        const { username, password } = req.body;
        
        const result = await accountService.createAccount( username, password ); 
        
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

    module.export = {
        createAccount,
        findAllAccounts,
        findAccountById,
        findAccountByUsername,
        updateAccount,
        deleteAccount,
    }

