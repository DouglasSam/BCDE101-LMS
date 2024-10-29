/**
 * @class UserManagementController
 * @classDesc Class that handles the users of the library
 * @property {UserManagementModel} model - The model for the controller
 * @property {UserManagementView} view - The view for the controller
 * @constructor - Creates a new UserManagementController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Sets the current view for the controller and adds all the button listeners
     */
    setCurrentView() {
        this.view.render(this.model.session.users.length);

        const dataSetButton = document.getElementById('dataSet');
        const resetButton = document.getElementById('reset');
        const userForm = document.getElementById('user-form');
        const searchInput = document.getElementById('search');

        dataSetButton.addEventListener('click', this.handleLoadUsersFromDataSet.bind(this));
        resetButton.addEventListener('click', this.handleResetUsers.bind(this));
        userForm.addEventListener('submit', this.handleAddUser.bind(this));
        searchInput.addEventListener('input', this.handleSearch.bind(this));

        this.view.updateUserTable(this.model.session.users)

        this.addButtonListeners();

    }

    /**
     * Add all button listeners for the page that are not initially rendered
     */
    addButtonListeners() {
        const editButtons = document.querySelectorAll('.update-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', this.handleEditUser.bind(this));
        });

        const cancelEditButtons = document.querySelectorAll('.cancel-edit');
        cancelEditButtons.forEach(button => {
            button.addEventListener('click', this.handleCancelEdit.bind(this));
        });

        const removeButtons = document.querySelectorAll('.remove-user');
        removeButtons.forEach(button => {
            button.addEventListener('click', this.handleRemoveUser.bind(this));
        });

        const updateButtons = document.querySelectorAll('.update-user');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleUpdateUser.bind(this));
        });
    }

    /**
     * EvenLister for cancel button in the edit view
     * @param event - event for the listener
     */
    handleCancelEdit(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const userId = event.target.attributes.getNamedItem('data-user-id').value;
        const user = this.model.getUserByID(userId);
        if (user) {
            this.view.SetToRowMode(rowID, user);
            this.addButtonListeners();
        }
    }

    /**
     * EventListener for witching to edit mode
     * @param event - event for the listener
     */
    handleEditUser(event) {
        const rowID = event.target.getAttribute('data-row-id');
        const userId = event.target.getAttribute('data-user-id');
        const user = this.model.getUserByID(userId);
        if (user) {
            this.view.setToEditMode(rowID, user);
            this.addButtonListeners();
        }
    }

    /**
     * EventListener for updating a user while in edit mode
     * @param event - event for the listener
     */
    handleUpdateUser(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const userId = event.target.attributes.getNamedItem('data-user-id').value;
        const newName = document.getElementById(`full-name-${rowID}`).value;
        const newEmail = document.getElementById(`email-${rowID}`).value;
        const newPassword = document.getElementById(`password-${rowID}`).value;
        const newRole = document.getElementById(`role-${rowID}`).value;
        let newMembershipId
        if (newRole === 'member') {
            newMembershipId = document.getElementById(`membershipId-${rowID}`).value;
        } else {
            newMembershipId = undefined;
        }
        const newUser = this.model.updateUser(userId, newName, newEmail, newPassword, newRole, newMembershipId);
        //An error occurred while updating user
        if (newUser === false) {
            document.getElementById('error-'+rowID).hidden = false;
        }
        else {
            this.view.SetToRowMode(rowID, newUser);
            this.addButtonListeners();
        }
    }

    /**
     * EventListener for delete button when editing a user
     * @param event - event for the listener
     */
    handleRemoveUser(event) {
        event.preventDefault();
        const userId = event.target.attributes.item(2).value;
        const user = this.model.getUserByID(userId);
        if (user !== null) {
            if (confirm(`Are you sure you want to permanently delete ${user.name}?`)) {
                if (this.model.removeUser(user)) {
                    this.view.updateUserTable(this.model.session.users);
                    this.addButtonListeners();
                }
            }
        }
    }

    /**
     * EventListener for the search input on the page allowing the user to search
     * for users by the name email or id
     */
    handleSearch() {
        const query = document.getElementById('search').value;
        const filteredUsers = this.model.searchUsers(query);
        this.view.updateUserTable(filteredUsers);
        this.addButtonListeners();
    }

    /**
     * EventListener for the form for adding a user to the system
     * @param event - event for the listener
     */
    handleAddUser(event) {
        event.preventDefault();
        const name = document.getElementById('full-name').value;
        const emailElement = document.getElementById('email');
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value
        const success = this.model.addUser(name, emailElement.value, password, role)
        if (success) {
            this.view.clearForm();
            this.view.updateUserTable(this.model.session.users);
            this.addButtonListeners();
            document.getElementById('invalid-user').hidden = true;
        }
        else {
            document.getElementById('invalid-user').hidden = false;
            emailElement.value = "";
            emailElement.focus();
        }
    }

    /**
     * EventListener for clearing all users from the system except for the logged-in user
     * @param event - event for the listener
     */
    handleResetUsers(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to permanently delete ALL other users?\nThis is irreversible`)) {
            this.model.clearAllUsers();
            this.view.updateUserTable(this.model.session.users);
        }
    }

    /**
     * EventListener for loading the users from the starting data set
     * @param event - event for the listener
     */
    handleLoadUsersFromDataSet(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to replace ALL users with those defined in the starting data set?`)) {

            this.model.resetUsersFromDataSet().then(() => {
                this.view.updateUserTable(this.model.session.users);
                this.addButtonListeners();
            });
        }
    }

}
