const wikiQueries = require("../db/queries.wikis.js");
const collaborationQueries = require("../db/queries.collaborations.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {

    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/wiki", {wikis});
            }
        })
    },

    indexPrivate(req, res, next){
        wikiQueries.getAllPrivateWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index");
            } else {
                function isCollab(callback){
                    collaborationQueries.findCollabMember(req.user.id, (err, res) => {
                        if(res == true){
                            var collabMember = req.user;
                            
                            callback(null, collabMember);
                        } else {
                            var nonCollabMember = req.user;
                            callback(nonCollabMember, null);
                        }
                    });
                }

               
                isCollab((nonCollabMember, collabMember) => {
                    const authorized = new Authorizer(nonCollabMember, wikis, collabMember).showPrivate();
                    if(authorized){
                        res.render("wikis/privateWiki", {wikis});
                     } else {
                        req.flash("notice", "You are not authorized.");
                        res.redirect("/wikis");
                    }
                 });      
            }
        })  
    },
    new(req, res, next){
        const authorized = new Authorizer(req.user).new();
        if(authorized){
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized.");
            res.redirect("/wikis");
        }
    },
    create(req, res, next){
        const authorized = new Authorizer(req.user).create();
        if(authorized){
            let newWiki = {
                title: markdown.toHTML(req.body.title),
                body: markdown.toHTML(req.body.body),
                private: req.body.private || false,
                userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized.");
            res.redirect("/wikis");
        }
    },
    show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                res.render("wikis/show", {wiki});
            }
        });
    },
    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                res.redirect(err, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },
    
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                
                function isCollab(callback){
                    collaborationQueries.findCollabMember(req.user.id, (err, res) => {
                        if(err){
                            console.log(err);
                        } else {
                            if(res == true){
                                var collabMember = req.user;
                                callback(null, collabMember);
                            } else {
                                var nonCollabMember = req.user;
                                callback(nonCollabMember, null);
                            }
                        }
                    });
                }

                isCollab((nonCollabMember, collabMember) => {
                    const authorized = new Authorizer(nonCollabMember, wiki, collabMember).edit();
                    if(authorized){
                        res.render("wikis/edit", {wiki});
                     } else {
                        req.flash("You are not authorized.")
                        res.redirect(`/wikis/${req.params.id}`)
                    }
                 });      
            }
        })  
    },

    update(req, res, next){
        
        function isCollab(callback){
            collaborationQueries.findCollabMember(req.user.id, (err, res) => {
                if(err){
                    console.log(err);
                } else {
                    if(res == true){
                        var collabMember = req.user;
                        callback(null, collabMember);
                    } else {
                        var nonCollabMember = req.user;
                        callback(nonCollabMember, null);
                    }
                }
            });
        }

        isCollab((nonCollabMember, collabMember) => {
            const authorized = new Authorizer(nonCollabMember, req.params.id, collaboMember).update();
            if(authorized){
                wikiQueries.updateWiki(req, req.body, (err, wiki) => {
                    if(err || wiki == null){
                        console.log(err);
                        res.redirect(401, `/wikis/${req.params.id}/edit`);
                    } else {
                        res.redirect(`/wikis/${req.params.id}`);
                    }
                });
            } else {
                req.flash("You are not authorized.")
                res.redirect(`/wikis/${req.params.id}/edit`);
            }
        });
    }
} 
