describe('Happy path of the user', () => {
    beforeEach(() => {
      cy.visit('localhost:3000/login');
    })
    it('Login, create a new game, start and stop a game, loads result, logout and logs back successfully', () => {
        const email = 'randomemail';
        const password = 'randompassword';
        const gamename = 'randomgame'

        // login
        cy.get('#form_email')
            .focus()
            .type(email);
        cy.get('#form_password')
            .focus()
            .type(password);
        cy.get('.ant-space-item > .ant-btn')
            .click();
        cy.get('.ant-input')
            .focus()
            .type(gamename);
        // create game
        cy.get('.Dashboard_addGameBox__nlTBG > .ant-btn')
            .click();
        // start game
        cy.get('.Dashboard_optBox__ugJ-7 > :nth-child(1)')
            .click();
        // copy link
        cy.get('.ant-typography-copy')
            .click();
        // ok
        cy.get('.ant-modal-confirm-btns > .ant-btn')
            .click();
        // stop game
        cy.get(':nth-child(1) > .ant-card > .ant-card-body > .Dashboard_optBox__ugJ-7 > :nth-child(1)')
            .click();
        // result
        cy.get('.ant-modal-confirm-btns > .ant-btn-primary')
            .click()
        // logout
        cy.get('.Wrap_navBox__Oz7EO > .ant-btn')
            .click()
        // logs back
        cy.get('#form_email')
            .focus()
            .type(email);
        cy.get('#form_password')
            .focus()
            .type(password);
        cy.get('.ant-space-item > .ant-btn')
            .click();
    })
  
  })