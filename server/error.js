export const handleError = (status, message) => {
    const error = new Error();
    error.status= status;
    error.emssage = message;
    return error;
}