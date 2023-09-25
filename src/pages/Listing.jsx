import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import Spinner from "../components/Spinner";

function Listing() {
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

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
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {isCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          {" "}
          Link Copied
        </p>
      )}
    </main>
  );
}

export default Listing;
