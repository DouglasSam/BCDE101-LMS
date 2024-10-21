/**
 * @file LibraryController.js
 * @fileOverview File that contains the controllers for the library system
 * The controllers handle the logic of the system and interact with the models and views
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
 * @method setCurrentView - Sets the current view for the controller
 * @method addButtonListeners - Adds all button listeners for the page that are not initially rendered
 * @method handleResetBooks - EventListener to clear all books from the storage
 * @method handleLoadBooksFromDataSet - EvenListener for resetting the books stored with the starting data set
 * @method handleAddBook - EventListener for adding a book to the catalogue
 * @method handleSearch - Handles the search bar on the page
 * @method handleEditBook - EventListener for changing the row in the table to the edit view
 * @method handleUpdateBook - EventListener for updating a book in the catalogue
 * @method handleRemoveBook - EventListener for removing a book from the catalogue
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
        this.view.render();
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

        this.view.changeToEditMode(rowID, book);
        this.addButtonListeners();
    }

    /**
     * EventListener for updating a book in the catalogue
     * @param event - event for the listener
     */
    handleUpdateBook(event) {
        event.preventDefault();
        const rowID = event.target.attributes.item(2).value;
        const newTitle = document.getElementById(`title-${rowID}`).value;
        const newAuthor = document.getElementById(`author-${rowID}`).value;
        const newISBN = document.getElementById(`isbn-${rowID}`).value;
        const newAvailability = document.getElementById(`availability-${rowID}`).checked;
        this.model.updateBook(newTitle, newAuthor, newISBN, newAvailability);
        const newBook = this.model.getBooks().find(book => book.isbn === newISBN);  
        this.view.changeToViewMode(rowID, newBook);
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
 * @method setCurrentView - Sets the current view for the controller
 * //TODO when finished
 * @constructor - Creates a new UserManagementController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementController {
    
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    
    setCurrentView() {
        this.view.render();
    }
    
}

/**
 * @class ReturnModel
 * @classDesc Class that handles the user returning books
 * @property {ReturnModel} model - The model for the controller
 * @property {ReturnView} view - The view for the controller
 * @method setCurrentView - Sets the current view for the controller
 * //TODO when finished
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

    toggleSearchForm(event) {
        event.preventDefault();
        this.model.toggleSearchMode();
        if (this.model.searchMode === 'simple') this.view.simpleSearch();
        else this.view.complexSearch();
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
 * @method setCurrentView - Sets the current view for the controller
 * @method handleButtonListeners - Handles all the button listeners for the page that are not initially rendered
 * @method handleExitDetailView - EventListener that will return the details view back to the list view
 * @method handleViewDetails - EventListener that will change the row to the details view
 * @method handleBorrow - EventListener that will handle a user borrowing a book
 * @method toggleSearchForm - EventListener that will toggle the search form between simple and complex
 * @method handleSimpleSearch - EventListener for handling and displaying a simple search
 * @method handleComplexSearch - EventListener for handling and displaying a complex search
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
        this.view.changeToViewMode(rowId, book);
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
        this.view.changeToDetailsMode(rowId, book);
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
            this.view.noBookFoundSearch(query, query, query);
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
            this.view.noBookFoundSearch(title, author, isbn, availableOnly);
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
 * @method setCurrentView - Sets the current view for the controller
 * @constructor - Creates a new HomeController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class HomeController {
    
    constructor(view) {
        this.view = view;
    }
    
    setCurrentView() {
        this.view.render();
    }
}

// Map of the different controllers to a string key
const controllers = new Map();

// On Load sets up the MVC groups of page loads last page if in the same session
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document Loaded");
    const catalogue = new Catalogue();
    controllers.set('user-management', new UserManagementController(new UserManagementModel(), new UserManagementView()));
    controllers.set('catalogue-management', new CatalogueManagementController(new CatalogueManagementModel(catalogue), new CatalogueManagementView()));
    controllers.set('return-books', new ReturnController(new ReturnModel(), new ReturnView()));
    controllers.set('catalogue-search', new SearchController(new SearchModel(catalogue), new SearchView()));
    controllers.set('home', new HomeController(new HomeView()));
    let currentPage = sessionStorage.getItem('currentPage');
    if (!currentPage) {
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

