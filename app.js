window.onload = function () {
    if (document.getElementById('loginDiv')) {
        document.getElementById('signupDiv').classList.add('hidden');
        document.getElementById('loginDiv').classList.remove('hidden');
    }
};

function showLogin() {
    document.getElementById('signupDiv').classList.add('hidden');
    document.getElementById('loginDiv').classList.remove('hidden');
}

function showSignup() {
    document.getElementById('signupDiv').classList.remove('hidden');
    document.getElementById('loginDiv').classList.add('hidden');
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert("All fields required");
        return;
    }

    // ⭐ EMAIL VALIDATION
    if (!email.includes("@")) {
        alert("Email must contain '@'");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.email === email)) {
        alert("User already exists!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    window.location.reload();
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("All fields required");
        return;
    }

    // ⭐ EMAIL VALIDATION
    if (!email.includes("@")) {
        alert("Email must contain '@'");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "feed.html";
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser && document.getElementById("userName")) {
    document.getElementById("userName").innerText = currentUser.name;
} else if (!currentUser && window.location.href.includes("feed.html")) {
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function createPost() {
    const text = document.getElementById("postText").value;
    const image = document.getElementById("postImage").value;

    if (!text) {
        alert("Post cannot be empty!");
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");

    const newPost = {
        id: Date.now(),
        text,
        image,
        author: currentUser.name,
        likes: [],
        date: new Date().toISOString()
    };

    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("postText").value = "";
    document.getElementById("postImage").value = "";

    displayPosts(posts);
}

function displayPosts(posts) {
    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";

    posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post";

        const formattedDate = new Date(post.date).toLocaleString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        div.innerHTML = `
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}" style="max-width:100%; margin-top:10px;">` : ""}
            <small>Author: ${post.author} - ${formattedDate}</small><br>

            <button class="likeBtn" onclick="toggleLike(${post.id})">
                ${post.likes.includes(currentUser.name) ? "❤️" : "🤍"} ${post.likes.length}
            </button>

            ${post.author === currentUser.name
                ? `<button class="editBtn" onclick="editPost(${post.id})">Edit</button>`
                : ""
            }

            ${post.author === currentUser.name
                ? `<button class="deleteBtn" onclick="deletePost(${post.id})">Delete</button>`
                : ""
            }
        `;

        postsDiv.appendChild(div);
    });
}

function toggleLike(id) {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find(p => p.id === id);

    if (!post) return;

    if (post.likes.includes(currentUser.name)) {
        post.likes = post.likes.filter(l => l !== currentUser.name);
    } else {
        post.likes.push(currentUser.name);
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}

function editPost(id) {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find(p => p.id === id);

    if (!post) return;

    const newText = prompt("Edit your post:", post.text);

    if (newText === null || newText.trim() === "") {
        alert("Post cannot be empty!");
        return;
    }

    post.text = newText;
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}

function deletePost(id) {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts = posts.filter(p => p.id !== id);

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}
