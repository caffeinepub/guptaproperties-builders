import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

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
    video : ?Storage.ExternalBlob;
  };

  public type PropertyInput = {
    title : Text;
    description : Text;
    price : ?Nat;
    location : ?Text;
    images : [Text];
    video : ?Storage.ExternalBlob;
  };

  var userProfiles = Map.empty<Principal, UserProfile>();
  let propertiesState = Map.empty<Nat, Property>();
  var nextPropertyId = 0;

  // Initialize authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

  public shared ({ caller }) func createProperty(input : PropertyInput) : async Property {
    assertAdmin(caller);

    let property : Property = {
      id = nextPropertyId;
      title = input.title;
      description = input.description;
      price = input.price;
      location = input.location;
      images = input.images;
      video = input.video;
    };

    propertiesState.add(nextPropertyId, property);
    nextPropertyId += 1;
    property;
  };

  public shared ({ caller }) func updateProperty(
    id : Nat,
    input : PropertyInput,
  ) : async Property {
    assertAdmin(caller);

    switch (propertiesState.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?_) {
        let updatedProperty : Property = {
          id;
          title = input.title;
          description = input.description;
          price = input.price;
          location = input.location;
          images = input.images;
          video = input.video;
        };
        propertiesState.add(id, updatedProperty);
        updatedProperty;
      };
    };
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    assertAdmin(caller);

    switch (propertiesState.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?_) {
        propertiesState.remove(id);
      };
    };
  };

  func assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
  };

  // ------------------------------------------
  // Diagnostic Endpoints
  // ------------------------------------------
  // Returns the caller's principal as text (for debugging) Available to all authenticated users
  public query ({ caller }) func getCallerPrincipalAsText() : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous cannot use this endpoint");
    };
    caller.toText();
  };

  // Returns a boolean indicating whether the caller is an admin (for debugging)
  // Available to all authenticated users
  public query ({ caller }) func checkIfCallerIsAdmin() : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous cannot use this endpoint");
    };
    AccessControl.isAdmin(accessControlState, caller);
  };
};
