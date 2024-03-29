import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeName, setChangeName] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setIsLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  function handleLogOut() {
    auth.signOut();
    navigate("/");
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleDeleting(id) {
    if (!window.confirm("Are you sure you want to delete")) return;
    await deleteDoc(doc(db, "listings", id));
    const updatedListings = listings.filter(listing => listing.id !== id);
    setListings(updatedListings);
    toast.success("Listing successfully deleted");
  }

  function handleEditing(id) {
    navigate(`/edit-listing/${id}`);
  }

  async function handleChangeName() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
        toast.success("Name updated successfully");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeName}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transition ease-in-out mb-6 ${
                changeName ? "bg-red-200 focus:bg-red-200" : "bg-white"
              }`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6"
            />
            <div className="flex justify-between whitespace-nowrap tet-sm sm:text-lg mb-6">
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1 cursor-pointer"
                  onClick={() => {
                    changeName && handleChangeName();
                    setChangeName(prev => !prev);
                  }}
                >
                  {changeName ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                className="text-blue-600  hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
                onClick={handleLogOut}
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!isLoading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6 ">
              {listings.map(listing => (
                <ListingItem
                  id={listing.id}
                  listing={listing.data}
                  key={listing.id}
                  handleDeleting={handleDeleting}
                  handleEditing={handleEditing}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
