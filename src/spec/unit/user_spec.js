const sequelize = require( "../../src/db/models" ).sequelize;
const User = require( "../../src/db/models" ).User;


describe( "User", () => {
  beforeEach( ( done ) => {
    sequelize.sync( { force: true } )
    .then( () => { done(); } )
    .catch( ( err ) => {
      console.log( err );
      done();
    } );
  } );
  describe( ".create()", () => {
    it( "should create new User when supplied valid values", ( done ) => {
      const values = {
        username: "valid",
        email: "valid@example.com",
        password: "123456",
        password: "1234567890",
      };

      User.create( values )
      .then( ( user ) => {
        expect( user.username ).toBe( values.username );
        expect( user.password ).toBe( values.password ); 
        expect( user.password ).toBe( values.password ); 
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    it( "should NOT create new User when supplied INVALID values", ( done ) => {
      const values = {
        username: "b",
        email: "idk@example",
        password: "0619",
      };
      User.create( values )
      .then( ( user ) => { 
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "Validation error" );
        expect( err.message ).toContain( "username" ); 
        expect( err.message ).toContain( "email" ); 
        expect( err.message ).toContain( "password" );
        done();
      } );
    } );
  } );
 
} );

