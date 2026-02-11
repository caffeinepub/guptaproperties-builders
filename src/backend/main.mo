import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

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

  let persistentAdmins = Set.empty<Principal>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Initialization to grant persistent admin rights
  public shared ({ caller }) func initializePersistentAdmin(admin : Principal) : async () {
    persistentAdmins.add(admin);
    AccessControl.assignRole(accessControlState, caller, admin, #admin);
  };

  public shared ({ caller }) func grantAdmin(user : Principal) : async () {
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    persistentAdmins.add(user);
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func revokeAdmin(user : Principal) : async () {
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    persistentAdmins.remove(user);
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public shared ({ caller }) func getAdminsList() : async [Text] {
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    persistentAdmins.toArray().map(
      func(p : Principal) : Text { p.toText() }
    );
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not persistentAdmins.contains(caller)) {
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

  // Property CRUD Operations
  public query ({ caller }) func listProperties() : async [Property] {
    // Public endpoint - no authorization required
    propertiesState.values().toArray();
  };

  public query ({ caller }) func getProperty(_id : Nat) : async ?Property {
    // Public endpoint - no authorization required
    propertiesState.get(_id);
  };

  public shared ({ caller }) func createProperty(input : PropertyInput) : async Property {
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };

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
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };

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
    if (not persistentAdmins.contains(caller)) {
      Runtime.trap("Unauthorized: Admin access required");
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
