import {
  useJsApiLoader,
  StandaloneSearchBox,
  GoogleMap,
} from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
interface MapsInputProps {
  setLocation: (location: string) => void;
  showMap: boolean;
  baseLatitude?: number;
  baseLongitude?: number;
}
const libraries: Libraries = ["places"];
const MapsInput = ({
  setLocation,
  showMap,
  baseLatitude,
  baseLongitude,
}: MapsInputProps) => {
  const mapCenter: google.maps.LatLngLiteral = {
    lat: baseLatitude ? baseLatitude : 0,
    lng: baseLongitude ? baseLongitude : 0,
  };
  const [coords, setCoords] = useState<google.maps.LatLngLiteral>(mapCenter);
  const [inputLocation, setInputLocation] = useState<string>("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: libraries,
  });
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const onSearchBoxMounted = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  };
  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places) {
        const selectedPlace = places[0];
        if (selectedPlace.formatted_address) {
          setLocation(selectedPlace.formatted_address);
          setInputLocation(selectedPlace.formatted_address);
          if (selectedPlace.geometry?.location) {
            setCoords({
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng(),
            });
          }
        }
      }
    }
  };
  return (
    <div className="w-1/1 flex justify-center items-center flex-col">
      {isLoaded && (
        <>
          {showMap && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "250px",
                maxWidth: "600px",
              }}
              center={coords}
              zoom={15}
            ></GoogleMap>
          )}
          <div className="w-1/1 m-2 flex">
            <div className="w-1/1">
              <StandaloneSearchBox
                onPlacesChanged={handlePlacesChanged}
                onLoad={onSearchBoxMounted}
              >
                <Input
                  type="text"
                  placeholder="Enter address..."
                  className="w-1/1"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                />
              </StandaloneSearchBox>
            </div>
            <Button
              className="mr-0"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setInputLocation("");
              }}
            >
              Clear
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MapsInput;
