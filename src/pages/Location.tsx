import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { salesService } from "@/services/ezyerpService";
import { useUserSession } from "@/hooks/useUserSession";
import { Customer } from "@/types/api";

const Location = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { officeid, officecode } = useUserSession();
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Create stable API function using useCallback
  const getCustomersFunction = useCallback(
    () => {
      const params = {
        officeid,
        officecode,
        financialyearid: "2",
        empid: "2"
      };
      return salesService.getCustomers(params);
    },
    [officeid, officecode]
  );

  // Fetch customers from API
  const { data, isLoading, error, execute } = useApi(getCustomersFunction);

  // Fetch customers on mount
  useEffect(() => {
    execute();
  }, [execute]);

  // Find the specific customer when data is loaded
  useEffect(() => {
    if (data?.customers && customerId) {
      // Try to find customer by customerid (primary field)
      const foundCustomer = data.customers.find(
        (c) => String(c.customerid) === String(customerId)
      );

      if (foundCustomer) {
        setCustomer(foundCustomer);
      }
    }
  }, [data, customerId]);

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (customer?.latitude && customer?.longitude) {
      const url = `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`;
      window.open(url, "_blank");
    }
  };

  // Get directions
  const getDirections = () => {
    if (customer?.latitude && customer?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${customer.latitude},${customer.longitude}`;
      window.open(url, "_blank");
    }
  };

  // Call customer
  const callCustomer = () => {
    if (customer?.mobileno) {
      const phone = customer.mobileno.split(",")[0].trim();
      window.location.href = `tel:${phone}`;
    }
  };

  // WhatsApp customer
  const whatsappCustomer = () => {
    if (customer?.whatsappno) {
      const phone = customer.whatsappno.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Customer Location</h1>
            {customer && (
              <p className="text-sm text-primary-foreground/80">
                {customer.customer_name || customer.account_name}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Loading State */}
        {isLoading && (
          <Card className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-destructive/10 border-destructive">
            <p className="text-destructive text-center">Error: {error}</p>
          </Card>
        )}

        {/* Customer Not Found */}
        {!isLoading && !error && !customer && data?.customers && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Customer not found</p>
              <p className="text-sm text-muted-foreground">
                The selected customer could not be found in the system.
              </p>
              <Button
                onClick={() => navigate("/customers")}
                variant="outline"
                className="mt-4"
              >
                Back to Customers
              </Button>
            </div>
          </Card>
        )}

        {/* Customer Details */}
        {customer && (
          <>
            {/* Customer Info Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
              
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {customer.customer_name || customer.account_name}
                  </p>
                </div>

                {/* Address */}
                {customer.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                )}

                {/* Area */}
                {customer.area_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{customer.area_name}</p>
                  </div>
                )}

                {/* Contact Person */}
                {customer.contact_person && (
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{customer.contact_person}</p>
                  </div>
                )}

                {/* Mobile */}
                {customer.mobileno && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{customer.mobileno}</p>
                  </div>
                )}

                {/* Email */}
                {customer.emailid && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.emailid}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Location Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h2>

              {customer.latitude && customer.longitude ? (
                <div className="space-y-4">
                  {/* Coordinates */}
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-mono text-sm">
                      {customer.latitude}, {customer.longitude}
                    </p>
                  </div>

                  {/* Map Preview */}
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${customer.latitude},${customer.longitude}&zoom=15`}
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={openInGoogleMaps}
                      variant="outline"
                      className="w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                    <Button
                      onClick={getDirections}
                      variant="outline"
                      className="w-full"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Location coordinates not available for this customer
                  </p>
                </div>
              )}
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {customer.mobileno && (
                  <Button
                    onClick={callCustomer}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
                
                {customer.whatsappno && (
                  <Button
                    onClick={whatsappCustomer}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
                
                {customer.emailid && (
                  <Button
                    onClick={() => window.location.href = `mailto:${customer.emailid}`}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Location;

