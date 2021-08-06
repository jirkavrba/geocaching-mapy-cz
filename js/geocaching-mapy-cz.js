(function () {

    function replaceOpenStreeMapWithMapyCz() {

        // If the maps hasn't been initialized yet, try it again in a second
        if (typeof window.wrappedJSObject.MapSettings === "undefined") {
            console.error("Cannot load map object.");
            setTimeout(replaceOpenStreeMapWithMapyCz, 1000);
            return;
        }

        const map = window.wrappedJSObject.MapSettings.Map;

        // Delete the original layers switch
        map._controlCorners.topright.innerHTML = "";

        // Remove all map layers except the geocaches one
        Object.keys(map._layers).forEach(id => {
            const layer = map._layers[id];
            const allowed = [
                "//tiles0{s}.geocaching.com/map.png?ts=1&x={x}&y={y}&z={z}&tl={tileLayer}{userSession}",
                "//tiles0{s}.geocaching.com/map.info?x={x}&y={y}&z={z}{userSession}&jsoncallback=?",
            ];

            if (!allowed.includes(layer._url)) {
                map.removeLayer(layer);
            }
        });

        // Add Mapy.cz layer
        const layer = window.wrappedJSObject.L.tileLayer(
            // TODO: Add loading from multiple servers to overcome per-domain request limits
            "https://m1.mapserver.mapy.cz/turist-m/{z}-{x}-{y}"
            // TODO: Providing options for some reason crashes the extension
            // {
            //     alt: "Mapy.cz turistická",
            //     tileUrl: "https://m{s}.mapserver.mapy.cz/turist-m/{z}-{x}-{y}",
            //     minZoom: 5,
            //     maxZoom: 18,
            //     subdomains: ["1", "2", "3", "4"],
            //     attribution: "Test"
            // }
        );

        layer.addTo(map);
    }

    // There has to be an initial delay 
    window.setTimeout(replaceOpenStreeMapWithMapyCz, 1000);
})();