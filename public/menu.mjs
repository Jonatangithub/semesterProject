export function toggleMenu(event) {
    var options = document.getElementById("options");
    var clickedTab = event.target;

    if (options.style.display === "block" && clickedTab.tagName === "A" && options.contains(clickedTab)) {
        options.style.display = "none";
    } else {

        options.style.display = (options.style.display === "block") ? "none" : "block";
    }
}
export function closeOptions(event) {
    var options = document.getElementById("options");
    if (event.target !== document.getElementById("menu-button") && !options.contains(event.target)) {
        options.style.display = "none";
    }
}
document.getElementById("menu-button").addEventListener("click", toggleMenu);
document.addEventListener("click", closeOptions);

document.querySelectorAll("#options a").forEach(function (option) {
    option.addEventListener("click", function (event) {
        event.preventDefault();
        var modalId = option.getAttribute("data-modal");
        var modal = document.getElementById(modalId);
        document.querySelectorAll(".modal").forEach(function (otherModal) {
            if (otherModal !== modal) {
                otherModal.style.display = "none";
            }
        });

        modal.style.display = "block";
        options.style.display = "none"; 
    });
});
document.querySelectorAll(".modal .close").forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
        var modal = closeButton.closest(".modal");
        modal.style.display = "none";
    });
});
window.addEventListener("click", function (event) {
    var modals = document.querySelectorAll(".modal");
    modals.forEach(function (modal) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
