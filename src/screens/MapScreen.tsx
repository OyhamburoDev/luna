import React from "react";
import { StatusBar, View } from "react-native";
import { useMapLogic } from "../hooks/useMapLogic";
import { useMapFilters } from "../hooks/useMapFilters";
import { useMapSearch } from "../hooks/useMapSearch";
import { useMapDetails } from "../hooks/useMapDetails";
import { MapWebView } from "../components/mapComponents/MapWebView";
import { MapSearchBar } from "../components/mapComponents/MapSearchBar";
import { MapFilters } from "../components/mapComponents/MapFilters";
import { MapBottomCard } from "../components/mapComponents/MapBottomCard";
import { PetMapModal } from "../components/mapComponents/PetMapModal";

export default function MapScreen() {
  // Hooks personalizados con toda la lógica
  const mapLogic = useMapLogic();
  const mapFilters = useMapFilters();
  const mapSearch = useMapSearch();

  // Función para manejar cambio de filtros (necesita acceso al webRef)
  const handleFilterChange = (filter: any) => {
    mapFilters.handleFilterChange(filter, mapLogic.webRef);
  };

  // Función para manejar cambios en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    mapLogic.setQuery(text);
    mapSearch.handleSearch(text);
  };

  // Función para seleccionar una sugerencia
  const handleSelectSuggestion = (suggestion: any) => {
    mapSearch.selectSuggestion(suggestion, mapLogic.webRef);
    // Actualizar el texto del input con la selección
    mapLogic.setQuery(suggestion.display_name);
  };

  // Nuevo hook para manejar detalles y modal
  const mapDetails = useMapDetails(mapLogic.currentUserId);

  // Función actualizada para "Ver más" que abre el modal
  const handleViewMore = () => {
    if (mapLogic.selected) {
      mapDetails.loadPetDetails(mapLogic.selected.id);
    }
  };

  // Funciones para el modal de detalles
  const handleContactPress = (contactInfo: any) => {
    mapDetails.handleContact(contactInfo);
  };

  const handleReportPress = (reportData: any) => {
    mapDetails.handleReport(reportData);
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
          onQueryChange={handleSearchChange}
          onPressLocate={mapLogic.onPressLocate}
          suggestions={mapSearch.suggestions}
          isSearching={mapSearch.isSearching}
          showSuggestions={mapSearch.showSuggestions}
          noResults={mapSearch.noResults}
          onSelectSuggestion={handleSelectSuggestion}
          onCloseSuggestions={mapSearch.closeSuggestions}
          isLocating={mapLogic.isLocating}
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
          onViewMore={handleViewMore}
          onMark={mapLogic.onMarkPin}
          onClose={mapLogic.onCloseSelection}
        />
        {/* Modal de detalles completos */}
        <PetMapModal
          visible={mapDetails.modalVisible}
          petData={mapDetails.selectedDetail}
          onClose={mapDetails.closeModal}
          onContact={handleContactPress}
          onReport={handleReportPress}
          isOwner={
            mapDetails.selectedDetail
              ? mapDetails.isOwner(mapDetails.selectedDetail.id)
              : false
          }
          currentUserId={mapLogic.currentUserId}
        />
      </View>
    </>
  );
}
