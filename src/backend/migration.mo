import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type UserProfile = {
    name : Text;
  };

  type Property = {
    id : Nat;
    title : Text;
    description : Text;
    price : ?Nat;
    location : ?Text;
    images : [Text];
    video : ?Text;
  };

  type OldActor = {
    owner : ?Principal;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    propertiesState : Map.Map<Nat, Property>;
    nextPropertyId : Nat;
  };

  type NewActor = {
    owner : ?Principal;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    propertiesState : Map.Map<Nat, Property>;
    nextPropertyId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
