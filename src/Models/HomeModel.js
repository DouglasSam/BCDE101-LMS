/**
 * Model for the Home page
 * @class HomeModel
 * @property {Session} session - The session object
 *
 */
class HomeModel {

    constructor(session) {
        this.session = session;
        this.loadLoggedInUser();
    }

    /**
     * Handles logging out the current logged-in user
     */
    logout() {
        this.session.loggedInUser = null;
        localStorage.removeItem('loggedInUser');
    }

    /**
     * Loads the logged-in user if they clicked remember me
     */
    loadLoggedInUser() {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        const email = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
        if (email) {
            this.session.loggedInUser = this.getUserByEmail(email);
        }
    }

    /**
     * Saves the logged-in user to the local storage if they clicked remember me
     */
    saveLoggedInUser() {
        localStorage.setItem('loggedInUser', JSON.stringify(this.session.loggedInUser.email));
    }

    /**
     * Logs in a user, if the provided email and password matched a librarian credentials
     * @param email - Of the user to log in
     * @param password - Of the user to log in
     * @param rememberMe - Whether the user wants to be remembered when the page reloads
     * @returns {boolean} - Whether the user was successfully logged in
     */
    logInUser(email, password, rememberMe) {
        const user = this.getUserByEmail(email);
        if (user) {
            // Only allow Librarians to log in
            if (user.role === "Librarian") {
                const valid = user.checkCredentials(email, password)
                if (valid) {
                    this.session.loggedInUser = user;
                    if (rememberMe)
                        this.saveLoggedInUser();
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Gets a user by their email
     * @param email - The email of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByEmail(email) {
        const filtered = this.session.users.filter(user => user.email === email);
        return filtered.length === 1 ? filtered[0] : null;
    }

}
