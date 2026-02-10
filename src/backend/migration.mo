import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

module {
  type OldUserRole = {
    #admin;
    #user;
    #guest;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldProperty = {
    id : Nat;
    title : Text;
    description : Text;
    price : ?Nat;
    location : ?Text;
    images : [Text];
    video : ?Storage.ExternalBlob;
  };

  type OldPropertyInput = {
    title : Text;
    description : Text;
    price : ?Nat;
    location : ?Text;
    images : [Text];
    video : ?Storage.ExternalBlob;
  };

  type Actor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    propertiesState : Map.Map<Nat, OldProperty>;
    nextPropertyId : Nat;
    accessControlState : AccessControl.AccessControlState;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : Actor) : Actor {
    old;
  };
};
