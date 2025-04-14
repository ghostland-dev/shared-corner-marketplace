
import { useListingsSearch } from './useListingsSearch';
import { useListingDetail } from './useListingDetail';
import { useListingMutation } from './useListingMutation';

export const useListings = () => {
  const { fetchListings, loading: searchLoading } = useListingsSearch();
  const { fetchListing, loading: detailLoading } = useListingDetail();
  const {
    createListing,
    updateListing,
    deleteListing,
    loading: mutationLoading,
  } = useListingMutation();

  return {
    fetchListings,
    fetchListing,
    createListing,
    updateListing,
    deleteListing,
    loading: searchLoading || detailLoading || mutationLoading,
  };
};

export type { ListingOptions } from './useListingsSearch';
