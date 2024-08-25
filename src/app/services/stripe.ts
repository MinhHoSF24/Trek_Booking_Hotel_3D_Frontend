import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PTo0VGVKfBbb09BSFFFDLCyhNMGGM3anbzxwTxim2wMVdsZjVhWMiKP2RHcFGoVU4F17lUgSCxoZ3Dj06BdQWG900m2KmAaDj');

export default stripePromise;
