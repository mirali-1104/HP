window.onload = function() {
    fetchUsers();
};

function fetchUsers() {
    fetch('/api/users') 
        .then(response => response.json())
        .then(users => {
            const userTableBody = document.getElementById('user-list');
            userTableBody.innerHTML = ''; 

            users.forEach(user => {
                const row = document.createElement('tr');
                row.setAttribute('data-user-id', user._id); 

                row.innerHTML = `
                    <td><input type="checkbox" class="user-checkbox" data-user-id="${user._id}"></td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.status}</td>
                    <td>
                        <button onclick="editUser('${user._id}')">Edit</button>
                        <button onclick="deleteUser('${user._id}')">Delete</button>
                    </td>
                `;

                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function editUser(userId) {
    
    window.location.href = `/edit-user.html?id=${userId}`;
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('User deleted');
            fetchUsers(); 
        })
        .catch(error => console.error('Error deleting user:', error));

    }
}
function selectAll() {
    const checkboxes = document.querySelectorAll('.user-checkbox');
    const selectAllCheckbox = document.getElementById('select-all');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

document.getElementById('bulk-delete-btn').addEventListener('click', function() {
    const selectedUsers = [];
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    
    checkboxes.forEach(checkbox => {
        const userId = checkbox.getAttribute('data-user-id'); 
        selectedUsers.push(userId);
    });
    
    if (selectedUsers.length > 0) {
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
            fetch('/api/users/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userIds: selectedUsers })
            })
            .then(response => response.json())
            .then(data => {
                alert('Selected users deleted');
                fetchUsers(); 
            })
            .catch(error => console.error('Error deleting selected users:', error));
        }
    } else {
        alert('No users selected!');
    }
});

