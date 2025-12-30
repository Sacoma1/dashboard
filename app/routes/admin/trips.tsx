import Header from "components/Header";

const Trips = () => {
  return (
    <main className="all-users">
      <Header
        title="Trips"
        description="View and edit AI-generative travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
};

export default Trips;
