
function toggleDisplay(show, elem) {
    if (show) {
        elem.classList.remove("d-none");
    }
    else {
        elem.classList.add("d-none");
    }
}

window.onload = () => {
    document.querySelector("#form-options").addEventListener("submit", (e) => {
        e.preventDefault();
    });
    document.querySelector("#check-vt").addEventListener("click", () => {
        toggleDisplay(
            document.querySelector("#check-vt").checked,
            document.querySelector("#text-vt-group"),
        );
    });
    document.querySelector("#check-redirect").addEventListener("click", () => {
        const elem = document.querySelector("#check-redirect-custom");
        elem.disabled = !document.querySelector("#check-redirect").checked;

        toggleDisplay(
            document.querySelector("#check-redirect").checked,
            document.querySelector("#text-redirect-group"),
        );
    });
    document.querySelector("#check-redirect-custom").addEventListener("click", () => {
        toggleDisplay(
            document.querySelector("#check-redirect-custom").checked,
            document.querySelector("#text-redirect-group"),
        );
    });
};
