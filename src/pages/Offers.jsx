import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers() {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const last = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(last);
        const listings = [];
        querySnap.forEach(listing =>
          listings.push({ id: listing.id, data: listing.data() })
        );
        setListings(listings);
        setIsLoading(false);
      } catch (err) {
        toast.error("Could not fetch listings");
      }
    }
    fetchListings();
  }, []);

  async function handleLoadMore() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const last = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(last);
      const listings = [];
      querySnap.forEach(listing =>
        listings.push({ id: listing.id, data: listing.data() })
      );
      setListings(prev => ({ ...prev, ...listings }));
      setIsLoading(false);
    } catch (err) {
      toast.error("Could not fetch listings");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold">Offers</h1>
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className=" sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2-xl:grid-cols-5 mt-6 mb-6 ">
              {listings.map(listing => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6  hover:border-slate-600 rounded transition duration-150 ease-in-out"
                onClick={handleLoadMore}
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
