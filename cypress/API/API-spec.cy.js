const apiData = require("../fixtures/apiData.json");

describe("Endpoint api/test/user/{id}", () => {
  const userId = apiData.id;
  let url = `/api/test/user/`;

  it("Smoke test for response status with existing {id}", () => {
    let initialResponse;
    cy.request({
      method: "GET",
      url: `${url}${userId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("user");
      expect(response.headers)
        .to.have.property("content-type")
        .and.include("application/json;charset=UTF-8");
      expect(response.body.user).to.include.all.keys(
        "id",
        "name",
        "gender",
        "age",
        "city",
        "registrationDate"
      );
      expect(response.body.user.id).to.be.eq(userId);
      expect(response.duration).to.be.lessThan(5000);
      initialResponse = response.body;
    });
    cy.request({
      method: "GET",
      url: `${url}${userId}`,
      failOnStatusCode: false,
    }).then((repeatedResponse) => {
      expect(repeatedResponse.body).to.deep.eq(initialResponse);
    });
  });

  it("Validation test for response status with non-existing id", () => {
    let nonExistId = 9;
    cy.request({
      method: "GET",
      url: `${url}${nonExistId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("user", null);
      expect(response.duration).to.be.lessThan(5000);
    });
  });

  it("Validation test for response status with fractional id", () => {
    let fractionalId = 9.99999;
    cy.request({
      method: "GET",
      url: `${url}${fractionalId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${fractionalId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for response status with negative id", () => {
    let negativeId = -10;
    cy.request({
      method: "GET",
      url: `${url}${negativeId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${negativeId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for response status with long id", () => {
    let longId = 99999999999;
    cy.request({
      method: "GET",
      url: `${url}${longId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${longId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for request with {null}", () => {
    let nullId = null;
    cy.request({
      method: "GET",
      url: `${url}${nullId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${nullId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for request with {0}", () => {
    let zeroId = 0;
    cy.request({
      method: "GET",
      url: `${url}${zeroId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${zeroId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for request without {id}", () => {
    let emptyId = " ";
    cy.request({
      method: "GET",
      url: `${url}${emptyId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("errorMessage");
      expect(response.body).to.have.property("user", null);
      expect(response.duration).to.be.lessThan(5000);
    });
  });

  it("Validation test for request with string {'string'}", () => {
    let stringId = "string";
    cy.request({
      method: "GET",
      url: `${url}${stringId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property(
        "errorMessage",
        `NumberFormatException: For input string: "${stringId}"`
      );
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Validation test for request with POST method and existing {id}", () => {
    cy.request({
      method: "POST",
      url: `${url}${userId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(405);
      expect(response.body).to.exist;
      expect(response.body).to.have.property("error", "Method Not Allowed");
      expect(response.body).to.have.property(
        "message",
        "Request method 'POST' not supported"
      );
      expect(response.duration).to.be.lessThan(5000);
    });
  });

  it("Validation test for request with incorrect headers", () => {
    cy.request({
      method: "GET",
      url: `${url}${userId}`,
      failOnStatusCode: false,
      headers: { "Content-Type": "0" },
    }).then((response) => {
      cy.validateSuccessResponse(response);
    });
  });

  it("Validation test for request with the id {'id'}", () => {
    let textId = `\'10\'`;
    cy.request({
      method: "GET",
      url: `${url}${textId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property('user',null); 
      expect(response.body).to.have.property('isSuccess', false);
    });
  });

  it("Destructive test for request with SQL injection", () => {
    let injectionId = ` or 1=1 --`;
    cy.request({
      method: "GET",
      url: `http://hr-challenge.dev.tapyou.com/api/test/user/${injectionId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property("errorMessage");
      expect(response.duration).to.be.lessThan(5000);
    });
  });

  it("Validation test of HTTP request", () => {
    cy.request({
      method: "GET",
      url: `http://hr-challenge.dev.tapyou.com/api/test/user/${userId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
    });
  });
});

describe("Endpoint api/test/users", () => {
  let url = `/api/test/users`;

  it("Smoke test for response status and ID lists", () => {
    let initialResponseGenderAny;
    let maleIdArr = [];
    let femaleIdArr = [];

    cy.request({
      method: "GET",
      url: `${url}?gender=any`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      initialResponseGenderAny = response.body.idList;
    });

    cy.request({
      method: "GET",
      url: `${url}?gender=any`,
      failOnStatusCode: false,
    }).then((repeatedResponse) => {
      cy.validateSuccessResponse(repeatedResponse);
      expect(repeatedResponse.body).to.have.property("idList");
      expect(repeatedResponse.body.idList).to.deep.eq(initialResponseGenderAny);
    });

    cy.request({
      method: "GET",
      url: `${url}?gender=male`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      maleIdArr = response.body.idList;
      maleIdArr.forEach((id) => {
        expect(initialResponseGenderAny).to.include(id);
      });
    });

    cy.request({
      method: "GET",
      url: `${url}?gender=female`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      femaleIdArr = response.body.idList;
      femaleIdArr.forEach((id) => {
        expect(initialResponseGenderAny).to.include(id);
      });
    });

    cy.then(() => {
      const idCrossings = maleIdArr.filter((id) => femaleIdArr.includes(id));
      expect(idCrossings).to.be.empty;
    });
  });

  it('Positive test with required parameter "gender" and valid non-required "city"', () => {
    let cityUserIdfromList;
    cy.request({
      method: "GET",
      url: `${url}?gender=female&city=Novosibirsk`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      cityUserIdfromList =
        response.body.idList[
          Math.floor(Math.random() * response.body.idList.length)
        ];

      cy.request({
        method: "GET",
        url: `/api/test/user/${cityUserIdfromList}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).to.have.property("user");
        expect(response.body.user.id).to.be.eq(cityUserIdfromList);
        expect(response.body.user.city).to.be.eq("Novosibirsk");
      });
    });
  });

  it('Positive test with required parameter "gender" and valid non-required "name"', () => {
    let nameUserIdfromList;
    cy.request({
      method: "GET",
      url: `${url}?gender=male&name=Gogol`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      nameUserIdfromList =
        response.body.idList[
          Math.floor(Math.random() * response.body.idList.length)
        ];

      cy.request({
        method: "GET",
        url: `/api/test/user/${nameUserIdfromList}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).to.have.property("user");
        expect(response.body.user.id).to.be.eq(nameUserIdfromList);
        expect(response.body.user.name).to.be.eq("Gogol");
      });
    });
  });

  it('Positive test with required parameter "gender" and valid non-required "age"', () => {
    let ageUserIdfromList;
    cy.request({
      method: "GET",
      url: `${url}?gender=any&age=18`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
      ageUserIdfromList =
        response.body.idList[
          Math.floor(Math.random() * response.body.idList.length)
        ];

      cy.request({
        method: "GET",
        url: `/api/test/user/${ageUserIdfromList}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).to.have.property("user");
        expect(response.body.user.id).to.be.eq(ageUserIdfromList);
        expect(response.body.user.age).to.be.eq("18");
      });
    });
  });

  it('Validation test with request required parameter "gender" and empty value', () => {
    cy.request({
      method: "GET",
      url: `${url}?gender=`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
    });
  });

  it('Validation test with request required parameter "gender" different from "male|female|any" (e.g. "nonbinary")', () => {
    cy.request({
      method: "GET",
      url: `${url}?gender=nonbinary`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
      expect(response.body).to.have.property("idList");
    });
  });

  it('Validation test for request without required parameter "gender"', () => {
    cy.request({
      method: "GET",
      url: `${url}?`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property("error", "Bad Request");
      expect(response.body).to.have.property(
        "message",
        "Required String parameter 'gender' is not present"
      );
      expect(response.body).to.have.not.property("idList");
    });
  });

  it('Validation test for request without required parameter "gender" and valid non-required "city"', () => {
    cy.request({
      method: "GET",
      url: `${url}?city=Moscow`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property("error", "Bad Request");
      expect(response.body).to.have.property(
        "message",
        "Required String parameter 'gender' is not present"
      );
      expect(response.body).to.have.not.property("idList");
    });
  });

  it("Validation test for request with POST method", () => {
    cy.request({
      method: "POST",
      url: `${url}?gender=male&id=999&city=Moscow&name=test`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(405);
      expect(response.body).to.have.property("error", "Method Not Allowed");
      expect(response.body).to.have.property(
        "message",
        "Request method 'POST' not supported"
      );
      expect(response.duration).to.be.lessThan(5000);
      expect(response.body).to.have.not.property("idList");
    });
  });

  it("Destructive test for request with SQL injection", () => {
    let injectionId = ` or 1=1 --`;
    cy.request({
      method: "GET",
      url: `http://hr-challenge.dev.tapyou.com/api/test/users?gender=${injectionId}`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateErrorResponse(response);
      expect(response.body).to.have.property("error");
    });
  });

  it("Validation test of HTTP request", () => {
    cy.request({
      method: "GET",
      url: `http://hr-challenge.dev.tapyou.com/api/test/users?gender=any`,
      failOnStatusCode: false,
    }).then((response) => {
      cy.validateSuccessResponse(response);
    });
  });
});
