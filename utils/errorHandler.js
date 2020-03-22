module.exports = (res, error) => {
    let statusCode = 500;
    let message = '';

    switch (error.code) {
        case 3003:
            statusCode = 401;
            message = 'Неверный email или пароль.';
        break;

        case 3006:
            statusCode = 401;
            message = 'Либо email, либо пароль не заполнен.';
        break;

        case 3033:
            statusCode = 409;
            message = 'Пользователь с таким email уже существует.';
        break;

        case 3036:
            statusCode = 401;
            message = 'Аккаунт заблокирован из-за большого количества неудачных входов.';
        break;

        case 3040:
            statusCode = 409;
            message = 'Неправильный формат email';
        break;

        case 3091:
            statusCode = 409;
            message = 'Время сессии закончилось. Пожалуйста авторизуйтесь заного.';
        break;

        case 8023:
            statusCode = 409;
            message = 'Пароль должен быть больше 6 символов';
        break;

        default:
            message = error.message;
        break;
    }

    res.status(statusCode).json({
        success: false,
        message: message
    })
};
