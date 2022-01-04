export const ENGLISH_TRANSLATIONS = {
    all: {
        cancel: 'Cancel'
    },
    main: {
        homeBookkeeping: 'Home bookkeeping',
        bill: 'Bill',
        history: 'History',
        planning: 'Planning',
        recording: 'Recording',
        settings: 'Settings',
        language: 'Language',
        russian: 'Russian',
        english: 'English',
        hello: 'Hello, {name}',
        user: 'User',
        logout: 'Logout',
        close: 'Close'
    },
    auth: {
        enterText: 'Login to work',
        registrationText: 'Registration for access',
        passwordRecovery: 'Password recovery',
        login: 'Login',
        registration: 'Registration',
        noAccount: 'No account?',
        forgotPassword: 'Forgot password?',
        ifAccount: 'Already have an account?',
        registerNow: 'Register now!',
        change: 'Change!',
        enterNow: 'Login now!',
        errors: {
            noLogin: 'Please log in access to page',
            notUserEmailIsExists: 'User with the given e-mail was not found',
        },
        language: {
            ru: 'Rus',
            en: 'Eng'
        },
        changePasswordSuccess: {
            message: 'Your new password has been successfully generated and has been sent to you by E-mail'
        }
    },
    overview: {
        name: 'Invoice page',
        bills: 'Accounts',
        createAnInvoice: 'Create an invoice',
        create: 'Create',
        edit: 'Edit',
        exchangeRates: 'Exchange Rates',
        currency: 'Currency',
        course: 'Course',
        date: 'Date'
    },
    history: {
        name: 'History page',
        chart: {
            income: 'Income',
            outcome: 'Outcome'
        },
        table: {
            date: 'Date',
            category: 'Category',
            type: 'Type',
            currency: 'Currency',
            amount: 'Amount',
            action: 'Action'
        }
    },
    records: {
        name: 'Records page',
        event: {
            title: 'Add event',
            success: 'Entry added successfully'
        },
        category: {
            add_title: 'Add category',
            edit_title: 'Edit Category',
            add_success: 'Category added successfully',
            edit_success: 'Category changed successfully',
        },
        profile: {
            add_success: 'Account successfully created',
            edit_success: 'Account changed successfully',
            delete_success: 'Account {name} deleted',
        }
    },
    sittings: {
        name: 'Setting page',
    },
    form: {
        username: 'Username',
        email: 'E-mail',
        password: 'Password',
        currentPassword: 'Current Password',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        loginAfterRegistration: 'Login after registration',
        billName: 'Enter account name',
        date: 'Enter the date',
        time: 'Enter the time',
        category: 'Select a category',
        currency: 'Select currency',
        available_currencies: 'Available currencies',
        main_currency: 'Choose your main currency',
        type: 'Select cash flow',
        amount: 'Enter the amount',
        description: 'Enter a description',
        title: 'Enter category name',
        add: 'Add',
        edit: 'Edit',
        changePassword: 'Change Password',
        wantDeleteAccount: 'Are you sure you want to delete the account?',
        errors: {
            emailRequired: 'E-mail is required',
            emailCorrect: 'Please enter a valid e-mail',
            passwordRequired: 'Password is required',
            passwordLong: 'Password must be equal or more than 6 characters',
            passwordNotMatch: 'Passwords do not match',
            userAlreadyRegister: 'This email is already registered',
            userNoRegister: 'User with this email does not exist',
            categoryRequired: 'Category cannot be empty',
            currencyRequired: 'Currency cannot be empty',
            typeRequired: 'Type cannot be empty',
            amountRequired: 'The amount cannot be empty',
            amountAboveZero: 'Amount must be greater than zero',
            amountInsufficient: 'The amount in this account is insufficient'
        },
        main_currency_help: 'All transfers made in other currencies will be converted to this currency, as well as it will be set by default in all forms'
    },
    server: {
        errors: {
            unknownError: 'Unknown error'
        }
    },
    category: {
        food: 'Питание',
        debts_loans: 'Debts, loans',
        auto: 'Auto',
        business_projects: 'Business, projects',
        household_appliances: 'Household appliances',
        mortgage: 'Mortgage',
        mc_i_t: 'Mobile communications, internet, TV',
        communal_payments: 'Communal payments',
        health_beauty: 'Health and beauty',
        financial_operations: 'Financial operations',
        cafes_restaurants: 'Cafes and restaurants',
        h_a_c: 'House, apartment, cottage',
        medicine_pharmacy: 'Medicine, pharmacy',
        pets: 'Pets',
        education: 'Education',
        public_transport: 'Public transport',
        clothes_footwear: 'Clothes and footwear',
        vacation_travel: 'Vacation, travel',
        multimedia: 'Multimedia',
        hypermarket: 'Hypermarket',
        e_c: 'Entertainment and celebrations',
        family_children: 'Family and Children',
        construction_repair: 'Construction and repair',
        hobbies_interests: 'Hobbies and interests',
        f_t_c: 'Fines, taxes, commissions',
        other: 'Other',
        charity: 'Charity',
        other_expenses: 'Other expenses',
        cash_withdrawal: 'Cash withdrawal',
        t_f_c_t_c: 'Transfer from card to card',
    },
    currency: {
        RUB: 'Ruble',
        USD: 'U.S. dollar',
        EUR: 'Euro',
        AUD: 'Australian dollar',
        GBP: 'British pound sterling',
        AMD: 'Armenian drams',
        BYN: 'Belarusian ruble',
        BGN: 'Bulgarian lev',
        BRL: 'Brazilian real',
        HUF: 'Hungarian forints',
        HKD: 'Hong Kong dollars',
        DKK: 'Danish krone',
        INR: 'Indian rupees',
        KZT: 'Kazakhstani tenge',
        CAD: 'Canadian dollar',
        KGS: 'Kyrgyz soms',
        CNY: 'CNY',
        MDL: 'Moldovan lei',
        NOK: 'Norwegian kroner',
        PLN: 'Polish zloty',
        RON: 'Romanian leu',
        XDR: 'SDR (Special Drawing Rights)',
        SGD: 'Singapore dollar',
        TJS: 'Tajik somoni',
        TRY: 'Turkish lira',
        TMT: 'New Turkmen manat',
        UZS: 'Uzbek soums',
        UAH: 'Ukrainian hryvnia',
        CZK: 'Czech crowns',
        SEK: 'Swedish crowns',
        CHF: 'Swiss frank',
        ZAR: 'South African rando',
        KRW: 'Won Republic of Korea',
        JPY: 'Japanese yen'
    }
};
