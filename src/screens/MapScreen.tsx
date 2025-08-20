import React from "react";
import { StatusBar, View } from "react-native";
import { useMapLogic } from "../hooks/useMapLogic";
import { useMapFilters } from "../hooks/useMapFilters";
import { MapWebView } from "../components/mapComponents/MapWebView";
import { MapSearchBar } from "../components/mapComponents/MapSearchBar";
import { MapFilters } from "../components/mapComponents/MapFilters";
import { MapBottomCard } from "../components/mapComponents/MapBottomCard";

export default function MapScreen() {
  // Hooks personalizados con toda la lógica
  const mapLogic = useMapLogic();
  const mapFilters = useMapFilters();

  // Función para manejar cambio de filtros (necesita acceso al webRef)
  const handleFilterChange = (filter: any) => {
    mapFilters.handleFilterChange(filter, mapLogic.webRef);
  };

  return (
    <>
      <StatusBar barStyle="default" />
      <View
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight || 0,
          backgroundColor: "black",
        }}
      >
        {/* Mapa principal */}
        <MapWebView
          webRef={mapLogic.webRef}
          currentLat={mapLogic.currentLat}
          currentLng={mapLogic.currentLng}
          onMessage={mapLogic.handleWebViewMessage}
        />

        {/* Buscador en la parte superior */}
        <MapSearchBar
          query={mapLogic.query}
          onQueryChange={mapLogic.setQuery}
          onPressLocate={mapLogic.onPressLocate}
        />

        {/* Filtros arriba de la bottom card */}
        <MapFilters
          activeFilter={mapFilters.activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Card inferior con detalles */}
        <MapBottomCard
          selected={mapLogic.selected}
          isMarked={
            mapLogic.selected ? mapLogic.isMarked(mapLogic.selected.id) : false
          }
          onViewMore={mapLogic.onViewMore}
          onMark={mapLogic.onMarkPin}
          onClose={mapLogic.onCloseSelection}
        />
      </View>
    </>
  );
}
