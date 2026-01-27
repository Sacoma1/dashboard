import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, getFirstWord, parseTripData } from "lib/utils";
import Header from "components/Header";
import InfoPill from "components/InfoPill";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import TripCard from "components/TripCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;

  if (!tripId) throw new Error("Trip ID is required");

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    alltrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
  };
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
  const imageUrls = loaderData?.trip?.imageUrls || [];
  const tripData = parseTripData(loaderData?.trip?.tripDetail);

  const {
    name,
    duration,
    itinerary,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
    travelStyle,
  } = tripData || {};

  const allTrips = loaderData.alltrips as Trip[] | [];

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const bestTimeToVisitAndWeatherInfo = [
    { title: "Best time to visit", items: bestTimeToVisit },
    { title: "Weather", items: weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and Edit AI-generated travel plans"
      />
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 5)
                  .map((i) => i.location)
                  .join(",") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>
        <section className="gallery">
          {imageUrls.map((url: string, i: number) => (
            <img
              src={url}
              alt="travel images"
              key={i}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]",
              )}
            />
          ))}
        </section>
        <section className="flex gap-3 md:gap-5 items-center">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, i) => (
                <ChipDirective
                  key={i}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                  text={getFirstWord(pill.text)}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}
            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        <section className="title">
          <article>
            <h3>
              {duration}-day {country} {travelStyle}
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>
        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day{dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((a, index: number) => (
                  <li key={index}>
                    <span className="flex-shrink-0">{a.time}</span>
                    <p className="flex-grow">{a.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {bestTimeToVisitAndWeatherInfo.map((s) => (
          <section key={s.title} className="visit">
            <div>
              <h3>{s.title}</h3>
              <ul>
                {s.items?.map((i) => (
                  <li key={i}>
                    <p className="flex-grow">{i}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
       
      </section>
       <section className="flex flex-col gap-6">
          <h2 className="p-24-semibold text-dark-100">Popular trips</h2>
          <div className="trip-grid">
            {allTrips.map(
              ({
                id,
                name,
                location,
                imageUrls,
                itinerary,
                interests,
                travelStyle,
                estimatedPrice,
              }) => (
                <TripCard
                  key={id}
                  id={id}
                  name={name}
                  imageUrl={imageUrls[0]}
                  location={itinerary?.[0]?.location ?? ""}
                  tags={[interests, travelStyle]}
                  price={estimatedPrice}
                />
              ),
            )}
          </div>
        </section>
    </main>
  );
};

export default TripDetail;
