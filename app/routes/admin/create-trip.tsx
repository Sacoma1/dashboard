import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import Header from "components/Header";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

/* =======================
   Loader (countries)
======================= */
export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flag,latlng,maps",
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.flag + " " + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

/* =======================
   Component
======================= */
const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =======================
     Handlers
  ======================= */
  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError("Please provide values for all fields");
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user?.$id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) {
        navigate(`/trips/${result.id}`);
      } else {
        setError("Failed to generate trip");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Data for UI
  ======================= */
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates: countries.find((c) => c.name === formData.country)
        ?.coordinates,
    },
  ];

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header title="Add a new trip" description="View and edit travel plans" />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          {/* Country */}
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value?: string }) =>
                e.value && handleChange("country", e.value)
              }
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((c) => c.name.toLocaleLowerCase().includes(query))
                    .map((c) => ({
                      text: c.name,
                      value: c.value,
                    })),
                );
              }}
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              id="duration"
              className="form-input"
              placeholder="Number of days"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {/* Dynamic selects */}
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                className="combo-box"
                change={(e: { value?: string }) =>
                  e.value && handleChange(key, e.value)
                }
                allowFiltering
              />
            </div>
          ))}

          {/* Map */}
          <div>
            <label>Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{
                    colorValuePath: "color",
                    fill: "#e5e5e5",
                  }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          {error && <p className="error">{error}</p>}

          <footer>
            <ButtonComponent
              type="submit"
              disabled={loading}
              className="button-class !h-12 !w-full"
            >
              <img
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                className={cn("size-5", {
                  "animate-spin": loading,
                })}
              />
              <span>{loading ? "Generating..." : "Generate"}</span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
