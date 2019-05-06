const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki.js");
const Collaboration = require("./models").Collaboration;
const User = require("./models").User;


module.exports = {

    getAllWikis(callback) {
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) =>{
            callback(err);
        })
    }, 
    addWiki(newWiki, callback) {
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki)
        })
        .catch((err) => {
            callback(err);
        })
    }, 

    getAllPrivateWikis(callback){
        return Wiki.all({
            where: { private: true}, 
            include: [
                {model: Collaboration, as: "collaborations", include: [
                    {model: User }
                ]}
            ]
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            console.log("Private wiki not found");
            console.log(err);
            callback(err);
        })   
    },

    getWiki(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
            callback(null, wiki)
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteWiki(req, callback) {

        return Wiki.findById(req.params.id)
        .then((wiki) => {

            const authorized = new Authorizer(req.user, wiki).destroy();

            if(authorized) {
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                })
            } else {
                req.flash("notice", "Not authorized.")
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
       });
    }, 

    updateWiki(id, updatedWiki, callback) {
        return Wiki.findById(id)
        .then((wiki)=> {
            if(!wiki){
                return callback("Wiki not found");
            }
            wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            })
            .then(() => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
        });
    }
}