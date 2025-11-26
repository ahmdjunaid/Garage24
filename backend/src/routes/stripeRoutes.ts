import express from 'express'
import { verifyJWT } from '../middleware/jwt';
import { StripeController } from '../controllers/stripe/implementation/stripeController';
import { TYPES } from '../DI/types';
import { container } from '../DI/container';

const router = express.Router()

const stripeController = container.get<StripeController>(TYPES.StripeController);

router.route('/create-subscribe-session').post(verifyJWT,stripeController.createSubscribeSession);
router.post("/stripe", express.raw({ type: "application/json" }),stripeController.handleWebhook);
router.route("/session/:sessionId").get(verifyJWT,stripeController.getCheckoutSession);

export default router;