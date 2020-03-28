module.exports = (res, error) => {
    let statusCode = 500;
    let message = '';

    switch (error.code) {
        case 3003:
            statusCode = 401;
            message = 'Неверный пароль.';
        break;

        case 3004:
            statusCode = 409;
            message = 'Пользователь с таким email не существует.';
        break;

        case 3033:
            statusCode = 409;
            message = 'Пользователь с таким email уже существует.';
        break;

        default:
            if (error.message !== '') {
                message = error.message;
            } else {
                message = 'Произошла неизвестная ошибка.';
            }
        break;
    }

    res.status(statusCode).json({
        success: false,
        message: message
    })
};
