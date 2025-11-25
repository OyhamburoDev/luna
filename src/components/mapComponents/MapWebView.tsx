import React from "react";
import { WebView } from "react-native-webview";

const BOTTOM_CARD_HEIGHT = 180;

interface MapWebViewProps {
  webRef: React.RefObject<WebView | null>;
  currentLat: number;
  currentLng: number;
  onMessage: (event: any) => void;
}

export const MapWebView: React.FC<MapWebViewProps> = ({
  webRef,
  currentLat,
  currentLng,
  onMessage,
}) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body { height:100%; margin:0; padding:0; font-family: system-ui, -apple-system, Roboto, 'Segoe UI', Arial; }
    #map { height:100vh; width:100vw; }

    .photo-marker .card {
  position: relative;
  width: 56px; height: 56px;       
  border-radius: 50%; overflow: hidden;  
  border: 2px solid #fff;
  box-shadow: 0 6px 16px rgba(0,0,0,.25);
  background: #eee;
}
    .photo-marker .card img { width:100%; height:100%; object-fit:cover; display:block; }
    .photo-marker .badge {
      position: absolute; left: 6px; right: 6px; bottom: 6px;
      background: linear-gradient(90deg,#667eea,#764ba2);
      color:#fff; font-weight:800; font-size:10px; letter-spacing:.3px;
      text-align:center; padding:2px 6px; border-radius:8px; text-transform:uppercase;
    }
    .photo-marker.marked .card {
      border-color: #ffcc00;
      box-shadow: 0 0 0 2px #ffcc00, 0 6px 16px rgba(0,0,0,.25);
    }
    .user-dot {
      background:#4285f4; width:14px; height:14px; border-radius:50%;
      border:3px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.3);
    }

    /* ↓↓↓ NUEVO: mover y separar el control de zoom ↓↓↓ */
    .leaflet-left .leaflet-control { margin-left: 12px; }
    .leaflet-bottom .leaflet-control { margin-bottom: ${
      BOTTOM_CARD_HEIGHT + 70
    }px; }
    /* ↑↑↑ con esto queda abajo-izquierda y por encima de tu bottom card */
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var lat = ${currentLat};
    var lng = ${currentLng};
    var R = 0.006;

   var DOG_IMAGES = [
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400",
  "https://images.unsplash.com/photo-1596854376505-075f6363fb9b?w=400"
];

var CAT_IMAGES = [
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
  "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
];

var SPECIES = ["PERRO", "GATO"]; // alternamos perro/gato

// 8 pins alrededor de tu posición con especie e imagen acordes
var pins = Array.from({ length: 8 }, (_, i) => {
  var species = SPECIES[i % SPECIES.length];
  var imgArr = species === "PERRO" ? DOG_IMAGES : CAT_IMAGES;
  var image = imgArr[i % imgArr.length];
  return {
    id: String(i + 1),
    lat: lat + (Math.random() * 2 - 1) * R,
    lng: lng + (Math.random() * 2 - 1) * R,
    image: image,
    label: i % 2 ? "AVISTAMIENTO" : "PERDIDO",
    species: species // 👈 importante para filtrar
  };
});

    // Desactivamos el zoom por defecto y lo reponemos abajo-izquierda
    var map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([lat, lng], 15);
    // L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Recentrar mapa desde React Native
window._recenter = function (la, ln) {
  try { map.setView([la, ln], map.getZoom(), { animate: true }); } catch(e){}
};

 // Función para centrar mapa y regenerar pins (para búsqueda)
window._centerAndRegeneratePins = function (newLat, newLng) {
  try {
    // Centrar mapa en nueva ubicación
    map.setView([newLat, newLng], 15, { animate: true });
    
    // Limpiar pins existentes (excepto el usuario)
    markerById.forEach(function (val) {
      map.removeLayer(val.marker);
    });
    markerById.clear();
    
    // Generar nuevos pins alrededor de la nueva ubicación
    var newPins = Array.from({ length: 8 }, (_, i) => {
      var species = SPECIES[i % SPECIES.length];
      var imgArr = species === "PERRO" ? DOG_IMAGES : CAT_IMAGES;
      var image = imgArr[i % imgArr.length];
      return {
        id: String(i + 1),
        lat: newLat + (Math.random() * 2 - 1) * R,
        lng: newLng + (Math.random() * 2 - 1) * R,
        image: image,
        label: i % 2 ? "AVISTAMIENTO" : "PERDIDO",
        species: species
      };
    });
    
    // Crear y agregar nuevos markers
    newPins.forEach(function(p) {
      var html =
        '<div class="card">' +
          '<img src="' + p.image + '" alt="pet" />' +
          (p.label ? '<div class="badge">' + p.label + '</div>' : '') +
        '</div>';

      var icon = L.divIcon({
        className: 'photo-marker',
        html: html,
        iconSize: [84,84],
        iconAnchor: [42,42]
      });

      var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
      markerById.set(p.id, { marker: m, data: p });

      m.on("click", function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "pin_tap", pin: p }));
      });
    });
    
    // Actualizar posición del usuario
    map.removeLayer(userMarker);
    userMarker = L.marker([newLat, newLng], { icon: userIcon }).addTo(map);
    
  } catch(e) {
    console.log('Error regenerating pins:', e);
  }
};

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    var userIcon = L.divIcon({
      className: 'user-marker',
      html: '<div class="user-dot"></div>',
      iconSize: [14,14], iconAnchor: [7,7]
    });
  var userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);

    var markerById = new Map();

    pins.forEach(function(p) {
      var html =
        '<div class="card">' +
          '<img src="' + p.image + '" alt="pet" />' +
          (p.label ? '<div class="badge">' + p.label + '</div>' : '') +
        '</div>';

      var icon = L.divIcon({
        className: 'photo-marker',
        html: html,
        iconSize: [84,84],
        iconAnchor: [42,42]
      });

      var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
      markerById.set(p.id, { marker: m, data: p });

      m.on("click", function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "pin_tap", pin: p }));
      });
    });

    // Nueva función de filtrado simplificada - solo recibe un filtro activo
    window._applyFilter = function (filterType) {
      markerById.forEach(function (val) {
        var data = val.data, marker = val.marker;
        var shouldShow = false;

        switch (filterType) {
          case 'all':
            shouldShow = true;
            break;
          case 'perdidos':
            shouldShow = data.label === "PERDIDO";
            break;
          case 'avistamientos':
            shouldShow = data.label === "AVISTAMIENTO";
            break;
          case 'perros':
            shouldShow = data.species === "PERRO";
            break;
          case 'gatos':
            shouldShow = data.species === "GATO";
            break;
        }

        if (shouldShow) {
          if (!map.hasLayer(marker)) marker.addTo(map);
        } else {
          if (map.hasLayer(marker)) map.removeLayer(marker);
        }
      });
    };

    window._markPin = function (id, marked) {
      var val = markerById.get(String(id));
      if (!val) return;
      var el = val.marker.getElement && val.marker.getElement();
      if (!el) return;
      if (marked) el.classList.add('marked'); else el.classList.remove('marked');
    };
  </script>
</body>
</html>
`;

  return (
    <WebView
      ref={webRef}
      source={{ html: htmlContent }}
      onMessage={onMessage}
      style={{ flex: 1 }}
      javaScriptEnabled
      domStorageEnabled
    />
  );
};
