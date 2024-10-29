/**
 * Stores variables shared across the different models
 */
class Session {
    
    static #START_BORROW_RECORD_ID = 5000
    
    constructor() {
        this.maxBorrowRecordID = Session.#START_BORROW_RECORD_ID;
        this.users = [];
        this.borrowingRecords = [];
        this.loggedInUser = null;
        this.catalogue = new Catalogue();
    }

    /**
     * Gets a user by their ID
     * Having it here instead of saying in UserManagement models is so that it can be used to get the user from other models
     * @param userId - The ID of the user to get
     * @returns {User|null} - The user object or null if not found
     */
    getUserByID(userId) {
        const filtered = this.users.filter(user => user.userId.toString() === userId.toString());
        return filtered.length === 1 ? filtered[0] : null;
    }

    getMemberByMemberID(memberId) {
        const filtered = this.users.filter(user =>
            user instanceof Member && user.membershipId.toString() === memberId.toString()
        );
        return filtered.length === 1 ? filtered[0] : null;
    }

    /**
     * Saves the books in the catalogue to local storage
     */
    saveBooksToStorage() {
        localStorage.setItem('library_books', JSON.stringify(this.catalogue.getBooks()));
    }

    /**
     * Saves the users in the session to local storage
     */
    saveUsersToStorage() {
        let usersJSON = JSON.stringify(this.users.map(user => user.JSONObject));
        localStorage.setItem('library_users', usersJSON);
    }
    
    /**
     * Saves the borrowing records in the session to local storage
     */
    saveBorrowingRecordsToStorage() {
        let recordsJSON = JSON.stringify(this.borrowingRecords.map(record => record.recordJSON));
        localStorage.setItem('library_borrowing_records', recordsJSON);
    }
    
}



// Map of the different controllers to a string key
const controllers = new Map();


// On Load sets up the MVC groups of page loads last page if in the same session
document.addEventListener('DOMContentLoaded', async () => {
    //Do not do if running tests using Jasmine
    if (document.title.includes("Jasmine Spec Runner")) return;
    console.log("Document Loaded");
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

    controllers.set('catalogue-management', new CatalogueManagementController(new CatalogueManagementModel(session), new CatalogueManagementView()));
    controllers.set('catalogue-search', new SearchController(new SearchModel(session), new SearchView()));
    controllers.set('user-management', new UserManagementController(userManagementModel, new UserManagementView()));
    controllers.set('home', new HomeController(homeModel, new HomeView()));
    controllers.set('borrow-record-management', new BorrowRecordManagerController(new BorrowRecordManagerModel(session), new BorrowRecordManagerView()));
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
