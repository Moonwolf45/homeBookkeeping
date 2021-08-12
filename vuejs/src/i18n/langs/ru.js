export const RUSSIAN_TRANSLATIONS = {
    main: {
        homeBookkeeping: 'Домашняя бухгалтерия',
        bill: 'Счёт',
        history: 'История',
        planning: 'Планирование',
        recording: 'Запись',
        settings: 'Настройки',
        language: 'Язык',
        russian: 'Русский',
        english: 'Английский',
        hello: 'Здравствуйте, {name}',
        user: 'Пользователь',
        logout: 'Выход',
        close: 'Закрыть'
    },
    auth: {
        enterText: 'Войдите для работы',
        registrationText: 'Регистрация для получения доступа',
        login: 'Войти',
        registration: 'Зарегестрироваться',
        noAccount: 'Нет аккаунта?',
        ifAccount: 'Уже есть аккаунт?',
        registerNow: 'Зарегистрироваться!',
        enterNow: 'Войти!',
        errors: {
            noLogin: 'Пожалуйста, авторизуйтесь для доступа к странице'
        },
        language: {
            ru: 'Рус',
            en: 'Анг'
        }
    },
    overview: {
        name: 'Страница счета',
        balance: 'Баланс',
        exchangeRates: 'Курс валют',
        currency: 'Валюта',
        course: 'Курс',
        date: 'Дата',
    },
    history: {
        name: 'Страница истории',
        chart: {
            income: 'Доход',
            outcome: 'Расход'
        },
        table: {
            date: 'Дата',
            category: 'Категория',
            type: 'Тип',
            currency: 'Валюта',
            amount: 'Сумма',
            action: 'Действие'
        }
    },
    records: {
        name: 'Страница записей',
        event: {
            title: 'Добавить запись',
            success: 'Запись успешно добавлена'
        },
        category: {
            add_title: 'Добавить категорию',
            edit_title: 'Изменить категорию',
            add_success: 'Категория успешно добавлена',
            edit_success: 'Категория успешно изменена',
        }
    },
    sittings: {
        name: 'Страница настройки',
    },
    form: {
        username: 'Имя пользователя',
        email: 'E-mail',
        password: 'Пароль',
        confirmPassword: 'Повторите пароль',
        loginAfterRegistration: 'Войти после регистрации',
        date: 'Введите дату',
        time: 'Введите время',
        category: 'Выберите категорию',
        currency: 'Выберите валюту',
        type: 'Выберите движение денежных средств',
        amount: 'Введите сумму',
        description: 'Введите описание',
        title: 'Введите название категории',
        add: 'Добавить',
        edit: 'Изменить',
        changePassword: 'Изменить пароль',
        errors: {
            emailRequired: 'E-mail не должен быть пустым',
            emailCorrect: 'Введите корректный e-mail',
            passwordRequired: 'Пароль не должен быть пустым',
            passwordLong: 'Пароль должен содержать не менее 6 символов',
            passwordNotMatch: 'Пароли не сопадают',
            userAlreadyRegister: 'Данный email уже зарегистрирован',
            userNoRegister: 'Пользователь с таким email не существует',
            categoryRequired: 'Категория не может быть пустой',
            currencyRequired: 'Валюта не может быть пустой',
            typeRequired: 'Тип не может быть пустой',
            amountRequired: 'Сумма не может быть пустой',
            amountAboveZero: 'Сумма должна быть больше нуля',
            amountInsufficient: 'Суммы на данном счету недостаточно'
        }
    },
    server: {
        errors: {
            unknownError: 'Неизвестная ошибка'
        }
    }
};
