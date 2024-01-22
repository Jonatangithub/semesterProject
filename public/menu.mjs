
document.getElementById("menu-button").addEventListener("click", function () {
    var options = document.getElementById("options");
    options.style.display = (options.style.display === "block") ? "none" : "block";
});

document.addEventListener("click", function (event) {
    var options = document.getElementById("options");
    if (event.target !== document.getElementById("menu-button") && event.target !== options) {
        options.style.display = "none";
    }
});

document.querySelectorAll("#options a").forEach(function(option) {
    option.addEventListener("click", function() {
        var modalId = option.getAttribute("data-modal"); 
        var modal = document.getElementById(modalId);
        modal.style.display = "block";
    });
});

document.querySelectorAll(".modal .close").forEach(function(closeButton) {
    closeButton.addEventListener("click", function() {
        var modal = closeButton.closest(".modal");
        modal.style.display = "none";
    });
});

window.addEventListener("click", function(event) {
    var modals = document.querySelectorAll(".modal");
    modals.forEach(function(modal) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
export function toggleMenu() {
    var options = document.getElementById("options");
    options.style.display = (options.style.display === "block") ? "none" : "block";
}

export function closeOptions(event) {
    var options = document.getElementById("options");
    if (event.target !== document.getElementById("menu-button") && event.target !== options) {
        options.style.display = "none";
    }
}
