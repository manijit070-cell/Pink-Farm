import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  avatarUrl?: string;
  membershipTier: string;
  walletBalance: number; // in paise (e.g. 15000 = ₹150)
  dietaryPreferences: string[];
}

export interface CustomerPreferences {
  whatsappAlerts: boolean;
  smsUpdates: boolean;
  emailNewsletter: boolean;
  preferredDeliverySlot: "morning" | "evening" | "any";
  deliveryNotes: string;
}

export interface CustomerStoreState {
  isLoggedIn: boolean;
  profile: CustomerProfile;
  addresses: CustomerAddress[];
  preferences: CustomerPreferences;

  // Actions
  loginCustomer: (customProfile?: Partial<CustomerProfile>) => void;
  logoutCustomer: () => void;
  updateProfile: (updated: Partial<CustomerProfile>) => void;
  updatePreferences: (updated: Partial<CustomerPreferences>) => void;
  addAddress: (address: Omit<CustomerAddress, "id">) => void;
  updateAddress: (id: string, updated: Partial<CustomerAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_PROFILE: CustomerProfile = {
  name: "Shivani Sharma",
  email: "shivani.sharma@pinkfarm.in",
  phone: "+91 98765 43210",
  dob: "1996-08-15",
  gender: "Female",
  avatarUrl: "",
  membershipTier: "Pink Farm Gold Member",
  walletBalance: 15000, // ₹150.00
  dietaryPreferences: ["100% Organic", "Preservative Free", "Farm Fresh Produce"],
};

const DEFAULT_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Shivani Sharma",
    phone: "9876543210",
    addressLine1: "House No. 42, Green Avenue, Phase 2, Dugri",
    addressLine2: "Near Rose Garden",
    city: "Ludhiana",
    state: "Punjab",
    pinCode: "141003",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    fullName: "Shivani Sharma",
    phone: "9876543210",
    addressLine1: "Suite 304, Cyber Heights, Ferozepur Road",
    addressLine2: "Opposite Grand Walk",
    city: "Ludhiana",
    state: "Punjab",
    pinCode: "141001",
    isDefault: false,
  },
];

const DEFAULT_PREFERENCES: CustomerPreferences = {
  whatsappAlerts: true,
  smsUpdates: true,
  emailNewsletter: true,
  preferredDeliverySlot: "morning",
  deliveryNotes: "Please ring the doorbell and leave with front security if unavailable.",
};

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false, // Default to false so logged-out state is respected
      profile: DEFAULT_PROFILE,
      addresses: DEFAULT_ADDRESSES,
      preferences: DEFAULT_PREFERENCES,

      loginCustomer: (customProfile) => {
        set((state) => ({
          isLoggedIn: true,
          profile: {
            ...state.profile,
            ...customProfile,
          },
        }));
      },

      logoutCustomer: () => {
        set({
          isLoggedIn: false,
        });
      },

      updateProfile: (updated) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updated,
          },
        }));
      },

      updatePreferences: (updated) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...updated,
          },
        }));
      },

      addAddress: (newAddr) => {
        const id = "addr-" + Date.now();
        set((state) => {
          let updatedList = [...state.addresses];
          if (newAddr.isDefault) {
            updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
          }
          return {
            addresses: [
              ...updatedList,
              {
                ...newAddr,
                id,
                isDefault: state.addresses.length === 0 ? true : newAddr.isDefault,
              },
            ],
          };
        });
      },

      updateAddress: (id, updated) => {
        set((state) => ({
          addresses: state.addresses.map((a) => {
            if (a.id === id) {
              return { ...a, ...updated };
            }
            if (updated.isDefault) {
              return { ...a, isDefault: false };
            }
            return a;
          }),
        }));
      },

      deleteAddress: (id) => {
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },
    }),
    {
      name: "pinkfarm_customer_store_v1",
    }
  )
);
