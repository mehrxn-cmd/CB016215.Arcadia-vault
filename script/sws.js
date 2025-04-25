if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/script.js")
            .then((registration) => {
                console.log("ServiceWorker registered with scope: ", registration.scope);
            })
            .catch((error) => {
                console.log("ServiceWorker registration failed: ", error);
            });
    });
}