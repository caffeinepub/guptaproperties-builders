import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
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

  stable var userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  let BOOTSTRAP_ADMIN = Principal.fromText("enn3j-adkwy-i7cxf-gi4bs-ihisb-mpsqc-lozg5-coeen-cba7n-y352m-4ae");

  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
