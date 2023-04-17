describe('Happy path of the user', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/register');
  })
  it('Register successfully', () => {
    const name = 'randomname';
    const email = 'randomemail';
    const password = 'randompassword';

    cy.get('#form_name')
      .focus()
      .type(name);
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



