import { authenticate, BASIC_PLAN, PRO_PLAN, PREMIUM_PLAN } from "../shopify.server";

export const action = async ({ request }) => {
    console.log('hitt');
    const { billing } = await authenticate.admin(request);
  
    const formData = await request.formData();
    console.log('This is your form data', formData);
    const plan = formData.get('plan');
  
    let planToUse;
    switch (plan) {
      case 'Pro Plan':
        planToUse = PRO_PLAN;
        break;
      case 'Premium Plan':
        planToUse = PREMIUM_PLAN;
        break;
      case 'Basic Plan':
      default:
        planToUse = BASIC_PLAN;
    }
  
    await billing.require({
      plans: [planToUse],
      isTest: true,
      onFailure: async () => billing.request({
        plan: planToUse,
        isTest: true
      })
    });
  
    return null;
  };