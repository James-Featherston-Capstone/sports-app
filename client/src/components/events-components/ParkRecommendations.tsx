import type { ParkRecommendation } from "@/utils/interfaces";
import { Button } from "../ui/button";
import LoadingCircleSpinner from "../Spinner";

interface ParkRecommendationProps {
  recommendationList: ParkRecommendation[];
  isLoading: boolean;
  updateLocation: (location: string) => void;
  regenerateRecommendations: () => void;
}
const ParkRecommendations = ({
  recommendationList,
  isLoading,
  updateLocation,
  regenerateRecommendations,
}: ParkRecommendationProps) => {
  const handleLocationChange = (location: string) => {
    updateLocation(location);
  };
  if (isLoading) return <LoadingCircleSpinner />;
  if (recommendationList.length === 0) {
    return <div>Unable to generate meeting locations.</div>;
  }
  return (
    <div className="overflow-y-auto flex flex-col justify-center items-center">
      {recommendationList.length === 0 && (
        <h1 className="bg-white w-1/1 rounded-lg text-center p-1 my-2">
          Unable to generate meeting points.
        </h1>
      )}
      {recommendationList.map((recommendation: ParkRecommendation) => {
        return (
          <div
            key={recommendation.recommendationTitle}
            className="bg-white rounded-md mt-2 p-3 flex justify-center flex-col items-center w-1/1"
          >
            <h1 className="text-xl bold text-center my-3">
              {recommendation.recommendationTitle}
            </h1>
            <h1 className="text-sm text-center my-1">
              {recommendation.location}
            </h1>
            {recommendation.displayName && (
              <h1 className="text-sm text-center my-1">
                {recommendation.displayName}
              </h1>
            )}
            <div className="flex">
              <p className="text-xs m-1">
                Max Distance: {Math.round(recommendation.maximumDistance)} Miles
              </p>
              <p className="text-xs m-1">
                Average Distance: {Math.round(recommendation.maximumDistance)}{" "}
                Miles
              </p>
            </div>
            <Button
              className="py-0 mt-2"
              size="sm"
              onClick={() => handleLocationChange(recommendation.location)}
            >
              <p className="text-xs m-0 p-0">Make new location</p>
            </Button>
          </div>
        );
      })}
      <Button size="sm" className="my-2" onClick={regenerateRecommendations}>
        <p className="text-xs">Regenerate</p>
      </Button>
    </div>
  );
};

export default ParkRecommendations;
