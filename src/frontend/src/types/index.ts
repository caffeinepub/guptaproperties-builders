// Local types for frontend-only data structures
// These are not backed by the backend canister

export interface UserProfile {
  name: string;
  email: string;
}

export interface Inquiry {
  name: string;
  email: string;
  propertyInterest: string;
  inquiryBody: string;
}
