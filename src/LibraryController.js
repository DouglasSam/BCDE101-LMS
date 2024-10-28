/**
 * @file LibraryController.js
 * @fileOverview File that contains the controllers for the library system
 * The controllers handle the logic of the system and interact with the models and views
 * @module LibraryController
 * @requires Catalogue
 * @requires CatalogueManagementModel
 * @requires CatalogueManagementView
 * @requires UserManagementModel
 * @requires UserManagementView
 * @requires ReturnModel
 * @requires ReturnView
 * @requires SearchModel
 * @requires SearchView
 * @requires HomeView
 * @requires sessionStorage
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */

/**
 * @class CatalogueManagementController
 * @classDesc Class that handled the management of the catalogue
 * The management of the catalogue includes adding, updating, and removing books
 * It also has a search function to search for books in the catalogue to make updating one book easier
 * It also has a reset function to reset the books in the catalogue to the starting data set
 * It also has a clear function to clear all books from the catalogue
 * @property {CatalogueManagementModel} model - The model for the controller
 * @property {CatalogueManagementView} view - The view for the controller
 * @constructor - Creates a new CatalogueManagementController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class CatalogueManagementController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Sets the current view for the controller
     */
    setCurrentView() {
        this.view.render(this.model.catalogue.getBooks().length);
        // DOM Elements
        this.bookForm = document.getElementById('book-form');
        this.searchInput = document.getElementById('search');
        this.dataSet = document.getElementById('dataSet');
        this.reset = document.getElementById('reset');

        // Bind event listeners
        this.bookForm.addEventListener('submit', this.handleAddBook.bind(this));
        this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        this.dataSet.addEventListener('click', this.handleLoadBooksFromDataSet.bind(this));
        this.reset.addEventListener('click', this.handleResetBooks.bind(this));

        // Initial render
        this.view.updateBookTable(this.model.getBooks());
        this.addButtonListeners();
    }

    /**
     * Add all button listeners for the page that are not initially rendered
     */
    addButtonListeners() {
        const updateBookButtons = document.querySelectorAll('.update-book');
        updateBookButtons.forEach(button => {
            button.addEventListener('click', this.handleUpdateBook.bind(this));
        });

        const removeBookButtons = document.querySelectorAll('.remove-book');
        removeBookButtons.forEach(button => {
            button.addEventListener('click', this.handleRemoveBook.bind(this));
        });

        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleEditBook.bind(this));
        });

        const cancelEditButtons = document.querySelectorAll('.cancel-edit');
        cancelEditButtons.forEach(button => {
            button.addEventListener('click', this.handleCancelEdit.bind(this));
        });
    }

    /**
     * EvenListener for canceling the edit form
     * @param event - event for the listener
     */
    handleCancelEdit(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const bookId = event.target.attributes.getNamedItem('data-book-id').value;
        const book = this.model.searchBooks({id: bookId})[0];
        this.view.SetToRowMode(rowID, book);
        this.addButtonListeners();
    }

    /**
     * EventListener to clear all books from the storage
     * @param event - event for the listener
     */
    handleResetBooks(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to permanently delete ALL books?`)) {
            this.model.clearAllBooks();
            this.view.updateBookTable(this.model.getBooks());
        }
    }

    /**
     * EvenListener for resetting the books stored with the starting data set
     * @param event - event for the listener
     */
    handleLoadBooksFromDataSet(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to replace ALL books with those defined in the starting data set?`)) {
            this.model.clearAllBooks();
            this.model.resetBooksFromDataSet().then(() => {
                this.view.updateBookTable(this.model.getBooks());
                this.addButtonListeners();
            });
        }
    }

    /**
     * EventListener for adding a book to the catalogue
     * @param event - event for the listener
     */
    handleAddBook(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        let genre = document.getElementById('genre').value;
        let location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        if (genre === '') genre = 'N/A';
        if (location === '') location = 'N/A';
        this.model.addBook(title, author, isbn, genre, location, description);

        this.view.clearForm();
        this.view.updateBookTable(this.model.getBooks());
        this.addButtonListeners();
    }

    /**
     * Handles the search bar on the page
     */
    handleSearch() {
        const query = this.searchInput.value;
        const filteredBooks = this.model.searchBooks({query: query});
        this.view.updateBookTable(filteredBooks);
        this.addButtonListeners();
    }

    /**
     * EventListener for changing the row in the table to the edit view
     * @param event - event for the listener
     */
    handleEditBook(event) {
        const rowID = event.target.getAttribute('data-row-id');
        const id = event.target.getAttribute('data-book-id');
        const book = this.model.searchBooks({id: id})[0];

        this.view.setToEditMode(rowID, book);
        this.addButtonListeners();
    }

    /**
     * EventListener for updating a book in the catalogue
     * @param event - event for the listener
     */
    handleUpdateBook(event) {
        event.preventDefault();
        const rowID = event.target.attributes.getNamedItem('data-row-id').value;
        const bookId = event.target.attributes.getNamedItem('data-book-id').value;
        const newTitle = document.getElementById(`title-${rowID}`).value;
        const newAuthor = document.getElementById(`author-${rowID}`).value;
        const newISBN = document.getElementById(`isbn-${rowID}`).value;
        const newLocation = document.getElementById(`location-${rowID}`).value;
        const newGenre = document.getElementById(`genre-${rowID}`).value;
        const newDescription = document.getElementById(`description-${rowID}`).value;
        const newAvailability = document.getElementById(`availability-${rowID}`).checked;
        this.model.updateBook(bookId, newTitle, newAuthor, newISBN, newGenre, newLocation, newDescription, newAvailability);
        const newBook = this.model.searchBooks({id: bookId})[0];
        this.view.SetToRowMode(rowID, newBook);
        this.addButtonListeners();
    }

    /**
     * EventListener for removing a book from the catalogue
     * @param event - event for the listener
     */
    handleRemoveBook(event) {
        event.preventDefault();
        const id = event.target.attributes.item(2).value;
        const book = this.model.catalogue.searchBooks({id: id})[0];

        if (confirm(`Are you sure you want to permanently delete ${book.title} by ${book.author }?`)) {
            this.model.removeBook(id);
            this.view.updateBookTable(this.model.getBooks());
            this.addButtonListeners();
        }
    }

}

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

/**
 * @class ReturnModel
 * @classDesc Class that handles the user returning books
 * @property {ReturnModel} model - The model for the controller
 * @property {ReturnView} view - The view for the controller
 * @constructor - Creates a new ReturnModel
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class ReturnController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    setCurrentView() {
        this.view.render();

    }
    
}

/**
 * @class SearchController
 * @classDesc Class that handles searching of the catalogue
 * Gives user the option to use a simple search query or complex
 *      allowing for searching in the different sections of the book or only available books
 * Allows users to view all details about the book handles the borrowing of books
 * @property {SearchModel} model - The model for the controller
 * @property {SearchView} view - The view for the controller
 * @constructor - Creates a new SearchController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class SearchController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Sets the current view for the controller
     */
    setCurrentView() {
        this.view.render(this.model.getBooks().length, this.model.searchMode);
        const searchToggleButton = document.getElementById("search-toggle");

        searchToggleButton.addEventListener('click', this.toggleSearchForm.bind(this));
        this.handleButtonListeners()
    }

    /**
     * Handles all the button listeners for the page that are not initially rendered
     */
    handleButtonListeners() {
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', this.handleViewDetails.bind(this));
        });

        const ExitDetailViewButtons = document.querySelectorAll('.exit-detail-view');
        ExitDetailViewButtons.forEach(button => {
            button.addEventListener('click', this.handleExitDetailView.bind(this));
        });

        const borrowButtons = document.querySelectorAll('.borrow-btn');
        borrowButtons.forEach(button => {
            button.addEventListener('click', this.handleBorrow.bind(this));
        });

        if (this.model.searchMode === 'simple') {
            document.getElementById('simple-search-form').addEventListener('submit', this.handleSimpleSearch.bind(this));
        }
        else {
            document.getElementById('complex-search-form').addEventListener('submit', this.handleComplexSearch.bind(this));
        }
    }


    /**
     * EventListener that will return the details view back to the list view
     * @param event - event for the listener
     */
    handleExitDetailView(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        const book = this.model.searchBooks({id: id})[0];
        this.view.setToNormalRowMode(rowId, book);
        this.handleButtonListeners()
    }

    /**
     * EventListener that will change the row to the details view
     * @param event - event for the listener
     */
    handleViewDetails(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        const book = this.model.searchBooks({id: id})[0];
        this.view.SetToDetailsRowMode(rowId, book);
        this.handleButtonListeners()

    }

    /**
     * EventListener that will handle a user borrowing a book
     * @param event - event for the listener
     */
    handleBorrow(event) {
        const id = event.target.getAttribute('data-book-id');
        const rowId = event.target.getAttribute('data-row-id');
        //TODO
        console.log(`Borrowing book ${id} from row ${rowId}`);
    }

    /**
     * EventListener that will toggle the search form between simple and complex
     * @param event - event for the listener
     */
    toggleSearchForm(event) {
        event.preventDefault();
        this.model.toggleSearchMode();
        if (this.model.searchMode === 'simple') {
            this.view.simpleSearch();
        }
        else {
            this.view.complexSearch();
        }
        this.handleButtonListeners();
    }

    /**
     * EventListener for handling and displaying a simple search
     * @param event - event for the listener
     */
    handleSimpleSearch(event) {
        event.preventDefault();
        const query = document.getElementById('simple-search-input').value;
        const searchResults = this.model.searchBooks({query: query});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch();
        }
        else {
            this.view.validSearch(searchResults);
            this.handleButtonListeners();
        }

    }

    /**
     * EventListener for handling and displaying a complex search
     * @param event - event for the listener
     */
    handleComplexSearch(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const genre = document.getElementById('genre').value
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const availableOnly = document.getElementById('search-available').checked;
        const searchResults = this.model.searchBooks({
            title: title ? title : false,
            author: author ? author : false,
            isbn: isbn ? isbn : false,
            genre: genre ? genre : false,
            location: location ? location : false,
            description: description ? description : false,
            availableOnly: availableOnly});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch();
        }
        else {
            this.view.validSearch(searchResults);
            this.handleButtonListeners();
        }
    }
}

/**
 * @class HomeController
 * @classDesc Class that handles the home page, no logic just a view
 * @property {HomeView} view - The view for the controller
 * @constructor - Creates a new HomeController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class HomeController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.logoutButton = document.getElementById('logout-btn');
    }

    /**
     * Sets the current view for the controller
     * Will display the login form if no user is logged in
     * Will display the home page if a user is logged in
     * Also handles displaying the nav and logout button
     */
    setCurrentView() {
        this.view.render(this.model.session.loggedInUser);
        if (this.model.session.loggedInUser) {
            //user is logged in
            this.logoutButton.hidden = false;
            document.getElementById("nav").hidden = false;
        }
        else {
            this.logoutButton.hidden = true;
            document.getElementById("nav").hidden = true;
            const loginForm = document.getElementById('login-form');
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

    }

    /**
     * EventListener for handling the login form
     * Will either log the user in and display a welcome page or display an error message in the form
     * @param event - event for the listener
     * @returns {Promise<void>} returns a promise
     */
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const rememberMe = document.getElementById('remember-me').checked;
        const password = document.getElementById('password').value;
        const errorTag = document.getElementById('invalid-login');

        if (await this.model.logInUser(email, password, rememberMe)) {
            this.setCurrentView()
        } else {
            errorTag.hidden = false;
        }

    }

}

// Map of the different controllers to a string key
const controllers = new Map();


// On Load sets up the MVC groups of page loads last page if in the same session
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Document Loaded");
    const catalogue = new Catalogue();
    const session = new Session();
    
    // Creates the default user of admin, will update name, and password if list of users exist in local storage
    if (session.users.length === 0) {
        const admin = new Librarian(1, 'admin', 'admin@admin', "admin");
        session.users.push(admin);
    }

    // user-management deals with user list initialization so must be done first
    const userManagementModel = new UserManagementModel(session);
    const homeModel = new HomeModel(session);
    

    // Logic for logout button
    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        homeModel.logout();
        loadPage('home', event);
    });

    controllers.set('catalogue-management', new CatalogueManagementController(new CatalogueManagementModel(catalogue), new CatalogueManagementView()));
    controllers.set('return-books', new ReturnController(new ReturnModel(), new ReturnView()));
    controllers.set('catalogue-search', new SearchController(new SearchModel(catalogue), new SearchView()));
    controllers.set('user-management', new UserManagementController(userManagementModel, new UserManagementView()));
    controllers.set('home', new HomeController(homeModel, new HomeView()));
    let currentPage = sessionStorage.getItem('currentPage');
    if (!currentPage) {
        currentPage = 'home';
    }
    //If there is no user logged in then the home page is loaded regardless of the last page
    if (localStorage.getItem('loggedInUser') === null) {
        currentPage = 'home';
    }

    loadPage(currentPage);
});

/**
 * Function to load a page by the id and EventListener for the navbar
 * @param id - id of the page to load
 * @param event - event for the listener
 */
function loadPage(id, event) {
    if (event) {
        event.preventDefault();
    }
    console.log("Loading page: " + id);
    const navLinks = document.getElementById("nav").getElementsByTagName('a');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    let controller = controllers.get(id);
    if (!controller) {
        console.error("Controller not found for page: " + id);
        controllers.get('home').setCurrentView();
        id = 'home';
    }
    if (id !== "home")
        document.getElementById(id).classList.add('active');
    controller.setCurrentView();
    sessionStorage.setItem('currentPage', id);
}



