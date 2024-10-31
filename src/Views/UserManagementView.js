/**
 * @class UserManagementView
 * @classdesc Handles the view for the user management
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class UserManagementView {

    /**
     * Renders the base view
     */
    render(numUsers) {
        document.getElementById("main").innerHTML =
            `
        <h2>Add a User</h2>
        <ul>
            <li><a id="dataSet" href="#">Reset from DataSet</a></li>
            <li><a id="reset" href="#">Reset</a></li>
        </ul>
        <h2>Enter new User Details:</h2>
        <form id="user-form">
              <div class="mb-3">
                <label for="full-name" class="form-label">Full Name:</label>
                <input type="text" class="form-control" id="full-name" placeholder="Full Name" required >
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" placeholder="email@email.com" required >
                  </div>
              
                  <div class="flex-fill">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password" placeholder="password" required >
                  </div>
              </div>
                  
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="genre" class="form-label">Role:</label>
                    <select class="form-select" id="role" >
                        <option value="librarian">Librarian</option>
                        <option value="member">Member</option>
                    </select>
                  </div>
              </div>
              <p id="invalid-user" class="text-danger" hidden>A user with that email already exists. Make sure the email is unique.</p>
              <button type="submit" class="btn btn-primary">Register User</button>
            </form>

        <h2>Filter Users</h2>
        <input type="text" id="search" class="w-100" placeholder="Filter by name, email, or id">
        
        <h2>There are ${numUsers} users in System</h2>
        <h3 id="users-shown"></h3>
        <table id="user-table" class="table table-striped">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Membership ID<br>(Members Only)</th>
                    <th>Action</th>                 
                </tr>
            </thead>
            <tbody>
                <!-- User rows will be inserted here -->
            </tbody>
        </table>
            `
        this.userTableBody = document.querySelector('#user-table tbody');
        this.tableCount = document.getElementById('users-shown');


    }

    /**
     * Updates the table of users with the list of users provided
     * @param users - The list of users to update the table with
     */
    updateUserTable(users) {
        this.tableCount.innerHTML = `Showing ${users.length} users from the system`;
        this.userTableBody.innerHTML = '';
        let rowNum = 1;
        users.forEach(user => {
            const row = document.createElement('tr');
            row.id = `user-${rowNum++}`;
            this.userTableBody.appendChild(row);
            this.SetToRowMode(row.id, user);
        });
    }

    /**
     * Sets the row to the basic view mode with the smaller details and an edit button
     * @param rowId - The id of the row to update
     * @param user - The user to display the details from
     */
    SetToRowMode(rowId, user) {
        document.getElementById(rowId).innerHTML =
            `
                <td>${user.userId}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.membershipId ? user.membershipId : "NA"}</td>
                <td>
                    <button class="update-btn btn btn-primary" data-user-id="${user.userId}" data-row-id="${rowId}">Edit or Delete Row</button>
                </td>
            `
    }

    /**
     * Changes the row to the edit mode with a form to update the user details
     * @param rowId - The id of the row to change to the update form
     * @param user - The user that to get the details from and will be updated or deleted
     */
    setToEditMode(rowId, user) {
        document.getElementById(rowId).innerHTML = `
        <td colspan="6">
            <form id="user-form-${rowId}">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="flex-fill">
                    <label for="user-id-${rowId}" class="form-label">User ID:</label>
                    <input type="number" class="form-control" id="user-id-${rowId}" placeholder="User ID" required value="${user.userId}" disabled>
                </div>
                <div class="flex-fill">
                    <label for="full-name-${rowId}" class="form-label">Full Name:</label>
                    <input type="text" class="form-control" id="full-name-${rowId}" placeholder="Full Name" required value="${user.name}">
                </div>
              </div>
              
              <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="flex-fill">
                    <label for="email-${rowId}" class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email-${rowId}" placeholder="email@email.com" required value="${user.email}">
                </div>
                
                <div class="flex-fill">
                    <label for="password-${rowId}" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="password-${rowId}" placeholder="Leave Blank to not update" >
                </div>
              </div>
              
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="flex-fill">
                        <label for="role-${rowId}" class="form-label">Role:</label>
                        <select class="form-select" id="role-${rowId}" disabled>
                            <option value="librarian" ${user.role === "Librarian" ? "selected" : ""}>Librarian</option>
                            <option value="member" ${user.role === "Member" ? "selected" : ""}>Member</option>
                        </select>
                    </div>
                    <div id="member-only-${rowId}" class="flex-fill" hidden>
                        <label for="membershipId-${rowId}" class="form-label">Membership ID:</label>
                        <input type="number" class="form-control" id="membershipId-${rowId}" placeholder="1111111" required value="${user.membershipId}">
                   </div>
                </div>
                
                <div id="error-${rowId}" class="mb-3 form-check" hidden>
                    <p class="text-danger">An error occured updating user, could be a duplicate email or membership ID</p>
                </div>
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <a class="btn btn-warning cancel-edit" data-user-id="${user.userId}" data-row-id="${rowId}">Cancel</a>
                    <button type="submit" class="btn btn-primary update-user" data-user-id="${user.userId}" data-row-id="${rowId}">Update User</button>
                    <a class="btn btn-danger remove-user" data-user-id="${user.userId}">Remove User</a>
                </div>
            </form>
        </td>
        `
        if (user.role === "Member") {
            document.getElementById(`member-only-${rowId}`).hidden = false;
        }
    }

    /**
     * Clears the add user form of any input
     */
    clearForm() {
        document.getElementById('user-form').reset();
    }

}