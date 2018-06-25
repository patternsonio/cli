export default function waitForCompile(status) {
  return async (req, res, next) => {
    try {
      await status.done();
      next();
    } catch (e) {
      next(e);
    }
  };
}
