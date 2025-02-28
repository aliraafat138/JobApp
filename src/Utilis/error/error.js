export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  if (process.env.MOOD === "dev") {
    return res
      .status(error.status || 400)
      .json({error, msg: error.msg, stack: error.stack});
  }
  return res.status(error.status || 400).json({error, msg: error.msg});
};
