const { Router } = require('express')

const userRouter = require('./users.routes');
const sessionRouter = require('./sessions.routes');
const dishesRouter = require('./dishes.routes');

const router = Router();

router.use("/users", userRouter);
router.use("/sessions", sessionRouter);
router.use("/dishes", dishesRouter);

module.exports = router;