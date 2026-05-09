document.addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll(".destination-detail img");

    if (!images.length) {
        return;
    }

    var overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var closeButton = document.createElement("button");
    closeButton.className = "image-zoom-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Fermer l'image agrandie");
    closeButton.textContent = "×";

    var zoomedImage = document.createElement("img");
    zoomedImage.className = "image-zoomed";
    zoomedImage.alt = "";

    overlay.appendChild(closeButton);
    overlay.appendChild(zoomedImage);
    document.body.appendChild(overlay);

    function closeZoom() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function openZoom(image) {
        zoomedImage.src = image.src;
        zoomedImage.alt = image.alt || "Image agrandie";
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    images.forEach(function (image) {
        image.classList.add("zoomable-image");
        image.addEventListener("click", function () {
            openZoom(image);
        });
    });

    closeButton.addEventListener("click", closeZoom);

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeZoom();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeZoom();
        }
    });
});
