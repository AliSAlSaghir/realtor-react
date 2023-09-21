import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeName, setChangeName] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  function handleLogOut() {
    auth.signOut();
    navigate("/");
  }

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
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
        </div>
      </section>
    </>
  );
}

export default Profile;
