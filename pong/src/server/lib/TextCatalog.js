/**
 * Provides all used Texts in the application
 * @type {Object}
 */
TextCatalog={
	createAccountTitle:"Create Pong Account",
	mailExists:"*Another player is already registered with this email address",
    nickExists:"*Another player is already registered with this nick name",
    invalidNick:"Your nick has to be at least 3 digits long",
    invalidMail:"This is not a valid mail adress",
    invalidPassword:"Your password has to be at least 6 digits long",
    loginFail:"Wrong Password or Nick Name",
    playgroundTitle:"Play Pong!"
}
// Export for require
module.exports=TextCatalog;