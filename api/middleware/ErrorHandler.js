exports.errorResponse = (res, message, statusCode = 500, moreInfo = {}) => {
    return res.status(statusCode).json({
      success: false,
      error: {
        statusCode,
        message,
        moreInfo,
      },
    });
};