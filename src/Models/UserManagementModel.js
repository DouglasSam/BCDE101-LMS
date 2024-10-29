/**
 * @class UserManagementModel
 * @classdesc Handles the management of the users
 *
 * @constructor - Creates a new UserManagementModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementModel {

    // User ID to start from when adding users
    #START_USER_ID = 100000;
    // The current free user ID
    maxUserId = this.#START_USER_ID;

    constructor(session) {
        this.session = session;
        this.loadUsersFromStorage();

    }

    /**
     * Removes a user from the system
     * @param user - The user to remove
     * @returns {boolean} - Whether the user was successfully removed
     */
    removeUser(user) {
        if (user === null) return false;
        if (this.session.loggedInUser.userId === user.userId) return false;
        this.session.users = this.session.users.filter(u => u.userId !== user.userId);
        this.session.saveUsersToStorage();
        return true;
    }

    /**
     * Updates a user with the given details
     * @param userId - The user ID of the user to update
     * @param newName - The new name of the user
     * @param newEmail - The email
     * @param newPassword - The new password
     * @param role - The original role of the user
     * @param newMembershipId - The membership ID of the user if it is a member
     * @returns {User|boolean} - The updated user or false if not updated
     */
    updateUser(userId, newName, newEmail, newPassword, role, newMembershipId=undefined) {
        const user = this.getUserByID(userId);
        if (user === null) return false;
        if (newEmail !== user.email && this.getUserByEmail(newEmail) !== null) return false
        if (newMembershipId !== undefined && this.session.users.filter(user => {
            if (user.membershipId === undefined) return false;
            return user.membershipId.toString() === newMembershipId
        }).length > 0) return false;
        user.updateUser(newName, newEmail, newPassword, role, newMembershipId);
        if (this.session.loggedInUser.userId === userId) this.session.loggedInUser = user;
        this.session.saveUsersToStorage();
        return user;
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

    /**
     * Gets a user by their ID
     * @param userId - The ID of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByID(userId) {
        return this.session.getUserByID(userId);
    }

    /**
     * Search users by the name email or id
     * @param query - The query to search for
     * @returns {User[]} - A list of users that match the query
     */
    searchUsers(query) {
        return this.session.users.filter(user => {
            let nameEmailUserId = user.name.includes(query) || user.email.includes(query) || user.userId.toString().includes(query);
            if (user.role === "Member") {
                return nameEmailUserId || user.membershipId.toString().includes(query);
            }
            return nameEmailUserId;
        });
    }

    /**
     * Loads the users from local storage into the session if any
     */
    loadUsersFromStorage() {
        const loggedIn = this.session.loggedInUser;
        this.session.loggedInUser = new Librarian(0, 'system', 'system@system', 'system');
        let usersJSON = localStorage.getItem('library_users');
        let users = usersJSON ? JSON.parse(usersJSON) : [];
        this.#loadFromArray(users);
        this.session.loggedInUser = loggedIn;
        // if (users !== []) {
        //     if (loggedIn.userId !== 1) {
        //         if (users.find(user => user.userId === 1) === undefined) {
        //             this.session.users = this.session.users.filter(user => user.userId !== 1);
        //         }
        //     }
        // }
        //
    }



    /**
     * Adds a user to the system, each user must have unique userId, email and members must have unique membershipId
     * @param name - The name of the user
     * @param email - The email of the user
     * @param password - The password of the user
     * @param role - The role of the user either Member or Librarian
     * @param userId - The user ID of the user, or undefined to let the system assign one
     * @param membershipId - The membership ID of the member, or undefined to let the system assign one
     *                      which will be the same as the userId
     * @param borrowedBooks - The books that the member has borrowed, or creates empty list if none
     * @returns {boolean} - Whether the user was successfully added
     */
    addUser(name, email, password, role, userId = undefined,  membershipId = undefined, borrowedBooks = []) {
        if (this.getUserByEmail(email) !== null) return false;
        if (userId === undefined) userId = this.maxUserId++;
        while (this.getUserByID(userId) !== null) userId = this.maxUserId++
        if (membershipId === undefined) membershipId = userId;
        this.session.users.push(this.session.loggedInUser.registerUser(userId, name, email, password, role, membershipId, borrowedBooks));
        this.session.saveUsersToStorage();
        return true;
    }

    /**
     * Clears all users from the system. Irreversible.
     */
    clearAllUsers() {
        this.session.users.length = 0;
        this.maxUserId = this.#START_USER_ID;
        this.session.users.push(this.session.loggedInUser)
    }

    /**
     * Loads the users from the array into the session
     * @param users - The array of users to load
     */
    #loadFromArray(users) {
        users.forEach(user => {
            if (user.userId === 1) this.updateUser(1, user.name, user.email, user.password, user.role);
            this.addUser(user.name, user.email, user.password, user.role, user.userId, user.membershipId, user.borrowedBooks);
        });
    }

    /**
     * Resets the users in the system to the default dataset. Will keep the default admin user.
     * @returns {Promise<void>} - A promise that resolves when the users have been reset
     */
    async resetUsersFromDataSet() {
        const userFetch = await fetch("./src/Data/Users.json");
        let users = [];
        if (userFetch.ok) {
            this.clearAllUsers();
            users = await userFetch.json();
            this.#loadFromArray(users);
        }
    }

}
