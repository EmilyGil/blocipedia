const request = require("request");
const server = require("../../src/server");
const sequelize = require("../../src/db/models/index").sequelize;
const base = "http://localhost:3000/wikis/";

const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;
        sequelize.sync({force:true}).then((res) => {

            User.create({
                username: "emily",
                email: "emily@email.com",
                password: "11106"
            })
            .then((user) => {
                this.user = user;
                
                Wiki.create({
                    title: "Wikis",
                    body: "Wikis body",
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        })
    })
    describe("STANDARD member performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
              request.get({         
                url: "http://localhost:3000/auth/fake",
                form: {
                  role: 0 
                }
              },
                (err, res, body) => {
                  done();
            });
          });

        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });
    
        describe("GET /topics/new", () => {
            
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
             })
            });
        });
    
        describe("POST /wikis/create", () => {
            beforeEach((done) => {
                User.create({
                  username: "emily",
                  email: "emily@email.com",
                  password: "11106"
                })
                .then((user)=> {
                  request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                      username: user.username,
                      userId: user.id,
                      email: user.email    
                    }
                  },
                    (err, res, body) => {
                      done();
                });
              });
            });
            
            const options = {
                url: `${base}create`,
                form: {
                    title: "LOL",
                    body: "number 1 esport game",
                    private: false,
                }
            };
            
            it("should create a new wiki and redirect", (done) => {
    
                request.post(options, (err, res, body) => {
    
                    Wiki.findOne({where: {title: "LOL"}})
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("LOL");
                        expect(wiki.body).toBe("number 1 esport game");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    
        describe("GET /wikis/:id", () => {
            
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });
    
        describe("POST /wikis/:id/destroy", () => {
    
            it("should  NOT deletee the wiki with the associated ID", (done) => {
    
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;

                    expect(wikiCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.wiki.id}/destory`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(wikis.length).toBe(wikiCountBeforeDelete);
                            done();
                        })
                    });
                })
            })
        });
    
        describe("GET /wikis/:id/edit", () => {
    
            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Wikis");
                done();
              });
            });
       
          });
    
          describe("POST /wikis/:id/update", () => {
    
            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis",
                        body: "Another Wikis"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });
    
            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis"
                    }
                };
    
                request.post(options, (err, res, body) => {
    
                    expect(err).toBeNull();
    
                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Wikis");
                        done();
                    });
                });
            });
          });



    })

    describe("PREMIUM member performing CRUD actions on Wiki", () => {

        beforeEach((done) => {
            request.get({         
              url: "http://localhost:3000/auth/fake",
              form: {
                role: 1 
              }
            },
              (err, res, body) => {
                done();
          });
        });
    
        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });

        describe("GET /topics/new", () => {
            
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
            })
            });
        });

        describe("POST /wikis/create", () => {
            beforeEach((done) => {
                User.create({
                username: "emily",
                email: "emily@email.com",
                password: "11106"
                })
                .then((user)=> {
                request.get({         
                    url: "http://localhost:3000/auth/fake",
                    form: {
                    username: user.username,
                    userId: user.id,
                    email: user.email    
                    }
                },
                    (err, res, body) => {
                    done();
                });
            });
            });
            
            const options = {
                url: `${base}create`,
                form: {
                    title: "LOL",
                    body: "number 1 esport game",
                    private: false,
                }
            };
            
            it("should create a new wiki and redirect", (done) => {

                request.post(options, (err, res, body) => {

                    Wiki.findOne({where: {title: "LOL"}})
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("LOL");
                        expect(wiki.body).toBe("number 1 esport game");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });

        describe("GET /wikis/:id", () => {
            
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });

        describe("POST /wikis/:id/destroy", () => {
    
            it("should  NOT deletee the wiki with the associated ID", (done) => {
    
                Wiki.all()
                .then((wikis) => {
                    const wikiCountBeforeDelete = wikis.length;

                    expect(wikiCountBeforeDelete).toBe(1);

                    request.post(`${base}${this.wiki.id}/destory`, (err, res, body) => {
                        Wiki.all()
                        .then((wikis) => {
                            expect(wikis.length).toBe(wikiCountBeforeDelete);
                            done();
                        })
                    });
                })
            })
        });

        describe("GET /wikis/:id/edit", () => {

            it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Wikis");
                done();
            });
            });
    
        });

        describe("POST /wikis/:id/update", () => {

            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis",
                        body: "Another Wikis"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });

            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis"
                    }
                };

                request.post(options, (err, res, body) => {

                    expect(err).toBeNull();

                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Wikis");
                        done();
                    });
                });
            });
        });
    });
    describe("admin user performing CRUD actions for Wiki", () => {

        beforeEach((done) => {
            User.create({
              username: "khang",
              email: "example@email.com",
              password: "12345",
              role: 2 
            })
            .then((user)=> {
              request.get({         
                url: "http://localhost:3000/auth/fake",
                form: {
                  username: user.username,
                  userId: user.id,
                  email: user.email,
                  role: user.role    
                }
              },
                (err, res, body) => {
                  done();
            });
          });
        });

        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                   
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });
    
        describe("GET /topics/new", () => {
            
            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
             })
            });
        });
    
        describe("POST /wikis/create", () => {
          
            const options = {
                url: `${base}create`,
                form: {
                    title: "LOL",
                    body: "number 1 esport game",
                    private: false,
                }
            };
            
            it("should create a new wiki and redirect", (done) => {
    
                request.post(options, (err, res, body) => {
    
                    Wiki.findOne({where: {title: "LOL"}})
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("LOL");
                        expect(wiki.body).toBe("number 1 esport game");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    
        describe("GET /wikis/:id", () => {
            
            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Wikis")
                    done();
                });
            });
        });
    
        describe("POST /wikis/:id/destroy", () => {
            it("should delete the wikis with the associated ID", (done) => {
                Wiki.all()
                .then((wikis) => {
                  const wikiCountBeforeDelete = wikis.length;
                  expect(wikiCountBeforeDelete).toBe(1);
                  request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                    Wiki.all()
                    .then((wikis) => {
                      expect(err).toBeNull();
                      expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                      done();
                    });
                  });
                });
              });
            });
    
        describe("GET /wikis/:id/edit", () => {
    
            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("Wikis");
                done();
              });
            });
       
          });
    
          describe("POST /wikis/:id/update", () => {
    
            it("should return a status code of 302", (done) => {
                request.post({
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis",
                        body: "Another Wikis"
                    }
                }, (err, res, body) => {
                    expect(res.statusCode).toBe(302);
                    done();
                })
            });
    
            it('should update the wiki with the given values', (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Wikis"
                    }
                };
    
                request.post(options, (err, res, body) => {
    
                    expect(err).toBeNull();
    
                    Wiki.findOne({
                        where: {id: this.wiki.id}
                    })
                    .then((wiki) => {
                        expect(wiki.title).toBe("Wikis");
                        done();
                    });
                });
            });
          });
    

    });

});
