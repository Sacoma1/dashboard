import Header from "components/Header";
import StatsCard from "components/StatsCard";
import TripCard from "components/TripCard";

import { getAllUsers, getUser } from "~/appwrite/auth";

import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "lib/utils";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { userXAxis, useryAxis } from "~/constants";

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    AllUsers,
  ] = await Promise.all([
    await getUser(),
    await getUsersAndTripsStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(4, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetail),
    imageUrls: imageUrls ?? [],
  }));

  const mapUsers: UsersItineraryCount[] = AllUsers.users.map((u) => ({
    imageUrl: u.imageUrl,
    name: u.name,
    count: u.itineraryCount,
  }));

  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    AllUsers: mapUsers,
  };
};

const dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, AllUsers } =
    loaderData;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`welcome ${user?.name ?? "Guest"}`}
        description="Track activity, trends and popular destinantion"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users Today"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((t) => (
            <TripCard
              id={t.id.toString()}
              key={t.id}
              name={t.name!}
              imageUrl={t.imageUrls}
              location={t.itinerary?.[0]?.location ?? ""}
              tags={[t.interests!, t.travelStyle!]}
              price={t.estimatedPrice!}
            />
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
    </main>
  );
};

export default dashboard;
