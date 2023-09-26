import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc =>
          listings.push({ id: doc.id, data: doc.data() })
        );
        setListings(listings);
      } catch (err) {
        console.log(err);
      }
    }
    fetchListings();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc =>
          listings.push({ id: doc.id, data: doc.data() })
        );
        setOfferListings(listings);
      } catch (err) {
        console.log(err);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc =>
          listings.push({ id: doc.id, data: doc.data() })
        );
        setRentListings(listings);
      } catch (err) {
        console.log(err);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc =>
          listings.push({ id: doc.id, data: doc.data() })
        );
        setSaleListings(listings);
      } catch (err) {
        console.log(err);
      }
    }
    fetchListings();
  }, []);

  if (isLoading) return <Spinner />;
  if (listings.length === 0) return <></>;
  return (
    listings && (
      <div>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${data.imgUrls[0]}}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
              <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded rounded-br-3xl">
                {data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-medium max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded rounded-tr-3xl">
                ${data.offer ? data.discountedPrice : data.regularPrice}
                {data.type === "rent" && " / month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="max-w-6xl mx-auto pt-4 space-y-6">
          {offerListings && offerListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Recent offers
              </h2>
              <Link to="/offers">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out ">
                  Show more offers
                </p>
              </Link>
              <ul className="sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {offerListings.map(listing => (
                  <ListingItem
                    key={listing.id}
                    data={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Places for rent
              </h2>
              <Link to="/category/rent">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out ">
                  Show more places for rent
                </p>
              </Link>
              <ul className="sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {rentListings.map(listing => (
                  <ListingItem
                    key={listing.id}
                    data={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Places for sale
              </h2>
              <Link to="/category/sale">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out ">
                  Show more places for sale
                </p>
              </Link>
              <ul className="sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {saleListings.map(listing => (
                  <ListingItem
                    key={listing.id}
                    data={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default Home;
