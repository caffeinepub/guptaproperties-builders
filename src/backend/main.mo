import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Property = {
    id : Nat;
    title : Text;
    description : Text;
    price : ?Nat;
    location : ?Text;
    images : [Text];
    video : ?Text;
  };

  let BOOTSTRAP_ADMIN : Principal = Principal.fromText("enn3j-adkwy-i7cxf-gi4bs-ihisb-mpsqc-lozg5-coeen-cba7n-y352m-4ae");

  var owner : ?Principal = null;
  var accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  var userProfiles = Map.empty<Principal, UserProfile>();
  let propertiesState = Map.empty<Nat, Property>();
  var nextPropertyId = 0;

  // Initialize bootstrap admin via dfx start
  include MixinAuthorization(accessControlState);

  // ------------------------------------------
  // User Profile Management
  // ------------------------------------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ------------------------------------------
  // Property CRUD Operations
  // ------------------------------------------
  public query ({ caller }) func listProperties() : async [Property] {
    propertiesState.values().toArray();
  };

  public query ({ caller }) func getProperty(_id : Nat) : async ?Property {
    propertiesState.get(_id);
  };

  public shared ({ caller }) func createProperty(
    title : Text,
    description : Text,
    price : ?Nat,
    location : ?Text,
    images : [Text],
    video : ?Text,
  ) : async Property {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create properties");
    };

    let property : Property = {
      id = nextPropertyId;
      title;
      description;
      price;
      location;
      images;
      video;
    };

    propertiesState.add(nextPropertyId, property);
    nextPropertyId += 1;
    property;
  };

  public shared ({ caller }) func updateProperty(
    id : Nat,
    title : Text,
    description : Text,
    price : ?Nat,
    location : ?Text,
    images : [Text],
    video : ?Text,
  ) : async Property {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update properties");
    };

    switch (propertiesState.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?_) {
        let updatedProperty : Property = {
          id;
          title;
          description;
          price;
          location;
          images;
          video;
        };
        propertiesState.add(id, updatedProperty);
        updatedProperty;
      };
    };
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete properties");
    };

    switch (propertiesState.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?_) {
        propertiesState.remove(id);
      };
    };
  };
};
