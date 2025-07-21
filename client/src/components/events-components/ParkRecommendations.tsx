import type { ParkRecommendation } from "@/utils/interfaces";
import { Button } from "../ui/button";

interface ParkRecommendationProps {
  recommendationList: ParkRecommendation[];
  isLoading: boolean;
  updateLocation: (location: string) => void;
}
const ParkRecommendations = ({
  recommendationList,
  isLoading,
  updateLocation,
}: ParkRecommendationProps) => {
  const handleLocationChange = (location: string) => {
    updateLocation(location);
  };
  if (isLoading) return <div>Loading...</div>;
  if (recommendationList.length === 0) {
    return <div>Unable to generate meeting locations.</div>;
  }
  return (
    <div className="overflow-y-auto">
      {recommendationList.map((recommendation: ParkRecommendation) => {
        return (
          <div
            key={recommendation.recommendationTitle}
            className="bg-white rounded-md mt-2 p-3 flex justify-center flex-col items-center"
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
    </div>
  );
};

export default ParkRecommendations;
