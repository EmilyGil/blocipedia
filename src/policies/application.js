module.exports = class ApplicationPolicy {
    
  constructor(user, record, collab) {
     this.user = user;
     this.record = record;
     this.collab = collab;
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

   _isCollab(){
    return this.collab;
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
   
  edit(){
    return this.record && (this._isPremium() || this._isAdmin() || this._isCollab() );
}

   showPrivate(){
    return this.record && (this._isPremium() || this._isAdmin() || this._isCollab() );
}


destroy() {
    return this.update();
   }
 }  