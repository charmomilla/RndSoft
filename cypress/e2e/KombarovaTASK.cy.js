
  describe('KombarovaTESTS', () => {
    beforeEach(() => {
      cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager')
    })
   describe('банковский менеджер производит манипуляции со списком клиентов', () => {

    it('Просмотр списка клиентов, навигация в списке по поиску', () => {
      cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/list')
      cy.get('.form-control').type('Hermoine') //проверка поиска по First Name
      cy.get('.border').should('contain', 'Hermoine')

      cy.get('.form-control').clear().type('Potter') //проверка поиска по Last Name
      cy.get('.border').should('contain', 'Potter')

      cy.get('.form-control').clear().type('E55555') //проверка поиска по Post Code
      cy.get('.border').should('contain', 'E55555')
      cy.get('.form-control').clear()
      })

     it('Просмотр списка клиентов, навигация в списке по сортировке ', () => {
      cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/list')
      cy.contains('First Name').click() //активация сортировки по First Name
      cy.get('tbody > :nth-child(1) > :nth-child(1)').should('contain', 'Ron')

      cy.contains('Last Name').click() //активация сортировки по Last Name
      cy.get('tbody > :nth-child(1) > :nth-child(2)').should('contain', 'Dumbledore')

      cy.contains('Post Code').click() //активация сортировки по Post Code
      cy.get('tbody > :nth-child(1) > :nth-child(3)').should('contain', 'E89898')
     })

     it('Создание нового клиента (invalid: numbers, symbols, empty)', () => {
       cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust')
       cy.wait(1000)
       cy.get(':nth-child(1) > .form-control').clear().type('!@#$%^&*()_+ text') //ввод Name
       cy.get(':nth-child(2) > .form-control').clear().type('  ') //ввод Last Name
       cy.get(':nth-child(3) > .form-control').clear().type('   😁 ') //ввод Post Code
       cy.get('form.ng-dirty > .btn').click() // форма с пустым значением не принимается
       cy.wait(1000)
       cy.get(':nth-child(2) > .form-control').clear().type('333 spaceText !@#$:><?') //ввод Last Name
       cy.get('form.ng-dirty > .btn').click()
       cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/list')
       cy.get('.border').should('contain', '333 spaceText !@#$:><?') //проверка что клиент создан
     })

      it('Создание нового клиента Legolas (valid) и банковского счёта', () => {
        cy.get('[ng-class="btnClass1"]').click()
        cy.get(':nth-child(1) > .form-control').type('Legolas') //ввод Name
        cy.get(':nth-child(2) > .form-control').type('Greenleaf') //ввод Last Name
       cy.get(':nth-child(3) > .form-control').type('333 spaceText !@#$:><?') //ввод Post Code
       cy.get('form.ng-dirty > .btn').click()
       cy.get('[ng-class="btnClass3"]').click()
       cy.get('.border').should('contain', 'Legolas') //проверка что Леголас создан
       cy.get('[ng-class="btnClass2"]').click() // переход на вкладку Open Account

       cy.get('#userSelect').select('Legolas Greenleaf') // создание долларового счёта
       cy.get('#currency').select('Dollar')
       cy.contains('Process').click()

       cy.get('#userSelect').select('Legolas Greenleaf') // создание фунтового счёта
       cy.get('#currency').select('Pound')
       cy.contains('Process').click()

       cy.get('[ng-class="btnClass3"]').click() // переход на таб accounts list

       cy.get('.marTop').scrollTo('bottom') // скролл вниз таблицы
       cy.wait(3000)
       cy.get('.border').should('contain', '1016') // проверка что долларовый счёт создался
       cy.get('.border').should('contain', '1017') // проверка что фунтовый счёт создался
     })
   })

})

   describe('Работа в кабинете пользователя', () => {
    beforeEach(() => {
      cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager')
    })

    it ('Открытие главной страницы после входа при отсутствии открытого счета', () => {
      cy.get('[ng-class="btnClass1"]').click() // создание нового пользователя
      cy.get(':nth-child(1) > .form-control').type('Legolas') //ввод Name
      cy.get(':nth-child(2) > .form-control').type('Greenleaf') //ввод Last Name
      cy.get(':nth-child(3) > .form-control').type('333 spaceText !@#$:><?') //ввод Post Code
      cy.get('form.ng-dirty > .btn').click()
      cy.get('.home').click()
      cy.get('.borderM > :nth-child(1) > .btn').click() //вход в кабинет пользователя
      cy.get('#userSelect').select('Legolas Greenleaf') //выбор аккаунта в селекторе
      cy.get('form.ng-valid > .btn').click()
      cy.get('.borderM').should('contain', 'Please open an account with us.') //проверка валидного логина при несуществующем счете по заголовку
   })

      it ('Выполнение различных действий с уже открытым счетом:', () => {
        cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust') // создание нового пользователя для действующего теста
        cy.get(':nth-child(1) > .form-control').type('Peter') //ввод Name
        cy.get(':nth-child(2) > .form-control').type('Parker') //ввод Last Name
        cy.get(':nth-child(3) > .form-control').type('333 spaceText !@#$:><?') //ввод Post Code
        cy.get('form.ng-dirty > .btn').click()

        cy.get('[ng-class="btnClass2"]').click() // создание нового счёта
        cy.get('#userSelect').select('Peter Parker') 
        cy.get('#currency').select('Dollar')
        cy.contains('Process').click()

        cy.get('.home').click()
        cy.get('.borderM > :nth-child(1) > .btn').click() //вход в кабинет пользователя
        cy.get('#userSelect').select('Peter Parker') //выбор аккаунта в селекторе
        cy.get('form.ng-valid > .btn').click()

        cy.get('[ng-class="btnClass2"]').click()
        cy.get('.form-control').type('1000') // вношу 1000 долларов на депозит
        cy.get('form.ng-dirty > .btn').click()
        cy.get('.error').should('contain', 'Deposit Successful')


        cy.get('[ng-class="btnClass3"]').click() // снятие с депозита 500 долларов
        cy.wait(1000)
        cy.get('.form-control').type('500')
        cy.wait(1000)
        cy.get('form.ng-dirty > .btn').click()
        cy.get('.error').should('contain', 'Transaction successful')

        cy.get(':nth-child(3) > :nth-child(2)').should('contain', '500') // проверка баланса после манипуляций с депозитом

        cy.get('[ng-class="btnClass3"]').click() // вывод суммы больше текущего баланса
        cy.wait(1000)
        cy.get('.form-control').type('700')
        cy.wait(1000)
        cy.get('form.ng-dirty > .btn').click()
        cy.get('.error').should('contain', 'Transaction Failed. You can not withdraw amount more than the balance.')
      })



      it ('Проверка работы с фильтрами в кабинете существующего пользователя по счету 1001(Гермиона Грейнджер)', () => {
       cy.get('.home').click()
       cy.get('.borderM > :nth-child(1) > .btn').click() //вход в кабинет пользователя
       cy.get('#userSelect').select('Hermoine Granger') //выбор аккаунта в селекторе
       cy.get('form.ng-valid > .btn').click()
       cy.get('[ng-class="btnClass1"]').click()

       cy.get('#start').type('2015-01-01T00:00') // выбор начальной даты в датапикере
       cy.wait(2000)
       cy.get('#end').type('2015-01-01T00:00') // выбор конечной даты в датапикере
       cy.get('[style="float:right;margin-top:-30px;"]').click() // нажатие кнопки ресет 


        cy.get('.home').click()
        cy.get('.borderM > :nth-child(1) > .btn').click() //вход в кабинет пользователя
        cy.get('#userSelect').select('Hermoine Granger') //выбор аккаунта в селекторе
        cy.get('form.ng-valid > .btn').click()

        cy.get('[ng-class="btnClass2"]').click()
        cy.get('.form-control').type('1000')
        cy.get('form.ng-dirty > .btn').click()

       cy.get('[ng-class="btnClass1"]').click()
       cy.get('#start').type('2023-07-07T00:00') // выбор начальной даты в датапикере
       cy.wait(2000)
       cy.get('#end').type('2023-07-07T00:00')
       cy.reload()


       cy.get('#anchor0 > :nth-child(2)').should('contain', '1000')
       cy.wait(2000)
       cy.get('#start').type('2015-01-01T00:00') // выбор начальной даты в датапикере
       cy.wait(2000)
       cy.get('#end').type('2015-07-26T00:00') // выбор конечной даты в датапикере


     })
      
})
