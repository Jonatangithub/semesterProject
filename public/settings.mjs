
import { toggleMenu } from "./menu.mjs";

document.addEventListener("DOMContentLoaded", function () {

    const darkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";
    setDarkMode(darkModeEnabled);


    const darkModeCheckbox = document.getElementById("darkModeCheckbox");
    darkModeCheckbox.addEventListener("change", function (event) {
        const isChecked = darkModeCheckbox.checked;
        setDarkMode(isChecked);


        localStorage.setItem("darkModeEnabled", isChecked);
    });
});

function setDarkMode(enabled) {
    const body = document.body;

    if (enabled) {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
    toggleMenu(event);
}