import ListingItem from "./ListingItem";
import Spinner from "./Spinner";

function Preview({
  isLoading,
  listings,
  lastFetchedListing,
  handleLoadMore,
  categoryType,
  children,
}) {
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold">{children}</h1>
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
        <p>There are no current {categoryType}</p>
      )}
    </div>
  );
}

export default Preview;
