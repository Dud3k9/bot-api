export interface SearchPlacesResponse {
  userParkings: UserParking[];
  nearbyParkings: any[];
  unnumberedSpotsParkings: UnnumberedSpotsParkings;
}

interface UnnumberedSpotsParkings {
  entries: any[];
}

interface UserParking {
  parkingId: string;
  latitude: number;
  longitude: number;
  distance: number;
  country: string;
  city: string;
  streetName: string;
  streetNumber: string;
  hasVirtualPilot: boolean;
  parkingStatus: number;
  hasFreePlacesLeft: boolean;
  includesMySpots: boolean;
  spots: Spot[];
}

interface Spot {
  id: string;
  spotNumber: string;
  effectivePrice: number;
  effectivePricePerHour: number;
  longTermRentingPrice: number;
  averageTotalRating: number;
  isParkingSpotActive: boolean;
  isOwnerAccountActive: boolean;
  isFree: boolean;
  isAvailable: boolean;
  ownerName: string;
  isMyParkingSpot: boolean;
}






export interface ReservedPlaces {
  entries: Entry[];
  paginationDto: PaginationDto;
}

export interface PaginationDto {
  totalElementsCount: number;
}

export interface Entry {
  id: string;
  city: string;
  streetName: string;
  streetNumber: string;
  latitude: number;
  longitude: number;
  status: number;
  level: string;
  sector: string;
  spotNumber: string;
  canDismiss: boolean;
  startTimestamp: string;
  endTimestamp: string;
  type: number;
  reservationSensitiveDataAccessible: boolean;
  creationTimestamp: string;
  effectiveCost: number;
  licensePlateNumber: string;
  targetName: string;
  hasMobilePilots: boolean;
  disableSensitiveDataAccessBuffer: boolean;
  enableSharing: boolean;
  cancellationTimestamp: null | string;
  isPermanentAssignment: boolean;
}