import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";

function Listing() {
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setIsLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
      } else {
        navigate("/");
        toast.error("Couldn't find your listing");
      }
      setIsLoading(false);
    }
    fetchListing();
  }, [navigate, params.listingId]);

  if (isLoading) return <Spinner />;
  return (
    <main>
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
        {listing?.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            >
              hi
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}

export default Listing;
