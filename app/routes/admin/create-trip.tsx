import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import Header from "components/Header";
import type { Route } from "./+types/create-trip";
import { selectItems } from "~/constants";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flag,latlng,maps"
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const handleSubmit = async () => {};
  const handleChange = async (
    key: keyof TripFormData,
    value: string | number
  ) => {};
  const countries = loaderData as Country[];

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper ">
      <Header title="Add a new trip" description="View and edit travel plans" />
      <section className="mt-2.5 wrapper-md">
        <form action="" className="trip-fomr" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="enter a number of days (5,12,...)"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{key}</label>
            </div>
          ))}
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
