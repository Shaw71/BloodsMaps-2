const mapWidth = 4000;
const mapHeight = 4000;
const bounds = [[0, 0], [mapHeight, mapWidth]];

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

// Affiche ton image localement
L.imageOverlay('maps.png', bounds, { noWrap: true }).addTo(map);
map.fitBounds(bounds);

// Outils de dessin
map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
    drawRectangle: false,
    drawMarker: false,
    drawPolyline: false
});

let tempLayer;

// Apparition de la fenêtre quand on finit de dessiner
map.on('pm:create', (e) => {
    tempLayer = e.layer;
    document.getElementById('adminModal').style.display = 'block';
});

// SAUVEGARDER DANS LE NAVIGATEUR (LocalStorage)
document.getElementById('saveZone').onclick = () => {
    const name = document.getElementById('zoneName').value;
    const owner = document.getElementById('zoneOwner').value;
    const color = document.getElementById('zoneColor').value;
    const coordinates = tempLayer.getLatLngs()[0];

    // On récupère les zones déjà stockées
    const zones = JSON.parse(localStorage.getItem('gta_map_data') || '[]');

    // On ajoute la nouvelle
    zones.push({ name, owner, color, coordinates });

    // On sauvegarde
    localStorage.setItem('gta_map_data', JSON.stringify(zones));

    location.reload(); // Rafraîchit pour afficher la zone
};

// CHARGER LES ZONES AU DÉMARRAGE
function loadZones() {
    const zones = JSON.parse(localStorage.getItem('gta_map_data') || '[]');
    zones.forEach(zone => {
        L.polygon(zone.coordinates, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.5,
            weight: 2
        })
        .addTo(map)
        .bindPopup(`<b>Territoire :</b> ${zone.name}<br><b>Gérant :</b> ${zone.owner}`);
    });
}

// ANNULER
document.getElementById('cancelZone').onclick = () => {
    map.removeLayer(tempLayer);
    document.getElementById('adminModal').style.display = 'none';
};

// EFFACER TOUT
function clearData() {
    if(confirm("Voulez-vous vraiment effacer tous les territoires ?")) {
        localStorage.removeItem('gta_map_data');
        location.reload();
    }
}

loadZones();
