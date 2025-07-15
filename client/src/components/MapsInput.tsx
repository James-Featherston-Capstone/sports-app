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
  location: string;
  setLocation: (location: string) => void;
  showMap: boolean;
}
const libraries: Libraries = ["places"];
const MapsInput = ({ location, setLocation, showMap }: MapsInputProps) => {
  const [coords, setCoords] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </StandaloneSearchBox>
            </div>
            <Button
              className="mr-0"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setLocation("");
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
