import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Home, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestListingRequest, getUnitsListingStatusRequest } from "@/api/landlordPropertyApi";

const UnitListing = () => {
  const { propertyId } = useParams();
  const [units, setUnits] = useState<any>({
    PENDING: [],
    APPROVED: [],
    ACTIVE: [],
    BLOCKED: [],
    ELIGIBLE: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [notes, setNotes] = useState("");

  // Fetch all unit listing statuses
  useEffect(() => {
    const fetchStatus = async () => {
      if (!propertyId) return;
      setFetching(true);
      try {
        const res = await getUnitsListingStatusRequest(propertyId);
        // Ensure all categories exist with proper fallbacks
        const data = res.data || {};
        setUnits({
          PENDING: data.PENDING || [],
          APPROVED: data.APPROVED || [],
          ACTIVE: data.ACTIVE || [],
          BLOCKED: data.BLOCKED || [],
          ELIGIBLE: data.ELIGIBLE || [],
        });
      } catch (error) {
        console.error("Failed to fetch listing status", error);
        setMessage("❌ Failed to fetch listing status.");
        // Reset to empty state on error
        setUnits({
          PENDING: [],
          APPROVED: [],
          ACTIVE: [],
          BLOCKED: [],
          ELIGIBLE: [],
        });
      } finally {
        setFetching(false);
      }
    };

    fetchStatus();
  }, [propertyId]);

  const handleSubmit = async () => {
    if (!propertyId || !selectedUnit) {
      setMessage("Missing property or unit ID.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await requestListingRequest(propertyId, selectedUnit.unit.id, { notes });

      setMessage("✅ Listing request submitted successfully.");
      setNotes("");
      setShowModal(false);

      // Refresh list
      const res = await getUnitsListingStatusRequest(propertyId);
      const data = res.data || {};
      setUnits({
        PENDING: data.PENDING || [],
        APPROVED: data.APPROVED || [],
        ACTIVE: data.ACTIVE || [],
        BLOCKED: data.BLOCKED || [],
        ELIGIBLE: data.ELIGIBLE || [],
      });
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Failed to submit listing request.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading unit listing statuses...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Listing Management</h3>
        <p className="text-gray-500">
          Manage your property units' listing statuses. Submit eligible units for review.
        </p>
      </div>

      {/* Categories */}
      {["PENDING", "APPROVED", "ACTIVE", "BLOCKED", "ELIGIBLE"].map((category) => (
        <div key={category} className="mb-6">
          <h4 className="font-semibold mb-2 capitalize">{category.toLowerCase()}</h4>
          {units[category] && units[category].length > 0 ? (
            <ul className="space-y-2">
              {units[category].map((item: any) => (
                <li key={item.unit.id} className="flex justify-between items-center border p-3 rounded">
                  <span>{item.unit.label}</span>
                  {category === "ELIGIBLE" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedUnit(item);
                        setShowModal(true);
                      }}
                    >
                      Request Listing
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No units in this category.</p>
          )}
        </div>
      ))}

      {message && <p className="text-sm text-center mt-2 text-gray-600">{message}</p>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit Listing Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Unit: <span className="font-medium">{selectedUnit?.unit.name}</span>
            </p>

            <Textarea
              placeholder="Add notes for admin (optional, e.g. revisions)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UnitListing;
