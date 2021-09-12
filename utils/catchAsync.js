module.exports = (fn, logMessage, errorCode, errorMessage) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.log(logMessage);
      console.log(error);
      next(error);
      res.status(errorCode).json({ err: errorMessage || error.message });
    });
  };
};
