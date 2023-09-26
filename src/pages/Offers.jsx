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
import Preview from "../components/Preview";

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
      setListings(prev => [...prev, ...listings]);
      setIsLoading(false);
    } catch (err) {
      toast.error("Could not fetch listings");
    }
  }

  return (
    <Preview
      isLoading={isLoading}
      listings={listings}
      handleLoadMore={handleLoadMore}
      lastFetchedListing={lastFetchedListing}
      categoryType="offers"
    >
      Offers
    </Preview>
  );
}

export default Offers;
