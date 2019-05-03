module.exports = class ApplicationPolicy {
    constructor(user, record) {
     this.user = user;
     this.record = record;
   }
   _isStandard() {
    return this.user && this.user.role == "standard";
  }
   _isOwner() {
     return this.record && (this.record.userId == this.user.id);
   }

   _isAdmin() {
     return this.user && this.user.role == "admin";
   }
    _isPremium() {
       return this.user && this.user.role == "premium";
   }

   new() {
     return this.user != null;
   }

   show() {
    return true;
  }

   create() {
     return this.new();
   }

   update() {
    return this.edit();
  }
   
    edit() {
     return this.new() && this.record;
   }


   destroy() {
    return this.update();
   }
 }  